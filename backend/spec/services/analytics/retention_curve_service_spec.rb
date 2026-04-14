require 'rails_helper'

RSpec.describe Analytics::RetentionCurveService do
  let(:user) { create(:user) }
  let(:user2) { create(:user) }
  let(:section) { create(:section) }
  let(:question) { create(:question, section: section) }
  let(:question2) { create(:question, section: section) }

  describe '.box_level_distribution' do
    it 'returns empty array when no states exist' do
      expect(described_class.box_level_distribution).to eq([])
    end

    it 'counts states per box level with percentages' do
      create(:user_question_state, user: user, question: question, box_level: 0)
      create(:user_question_state, user: user, question: question2, box_level: 4)

      result = described_class.box_level_distribution
      expect(result.length).to eq(2)

      box0 = result.find { |r| r['box_level'] == 0 }
      expect(box0['count']).to eq(1)
      expect(box0['percentage']).to eq(50.0)
    end
  end

  describe '.retention_rate_per_box' do
    it 'returns zero values for empty box levels' do
      result = described_class.retention_rate_per_box
      expect(result.length).to eq(5)
      result.each do |r|
        expect(r[:total_states]).to eq(0)
        expect(r[:retention_rate]).to eq(0.0)
      end
    end

    it 'computes retention rate from correct_count / attempt_count' do
      create(:user_question_state, user: user, question: question, box_level: 2, attempt_count: 10, correct_count: 7)

      result = described_class.retention_rate_per_box
      box2 = result.find { |r| r[:box_level] == 2 }
      expect(box2[:retention_rate]).to eq(70.0)
      expect(box2[:avg_attempts]).to eq(10.0)
    end
  end

  describe '.time_to_mastery_analysis' do
    it 'returns nil values when no mastered states exist' do
      result = described_class.time_to_mastery_analysis
      expect(result[:avg_days]).to be_nil
      expect(result[:distribution]).to eq([])
    end

    it 'computes duration from first attempt to mastery' do
      first_attempt_time = 10.days.ago
      mastery_time = 2.days.ago

      create(:question_attempt, user: user, question: question, created_at: first_attempt_time, response_time_ms: 1000)
      create(:user_question_state, :mastered, user: user, question: question, last_reviewed_at: mastery_time)

      result = described_class.time_to_mastery_analysis
      expect(result[:avg_days]).to be_a(Float)
      expect(result[:avg_days]).to be > 0
      expect(result[:median_days]).to be_a(Integer)
    end
  end

  describe '.retention_decay_curves' do
    it 'returns 5 entries (one per box level) even with no data' do
      result = described_class.retention_decay_curves
      expect(result.length).to eq(5)
      result.each { |r| expect(r[:user_count]).to eq(0) }
    end

    it 'aggregates per-user retention within a single query' do
      # User1: box_level 0, 3 attempts, 2 correct → 66.7%
      create(:user_question_state, user: user, question: question, box_level: 0, attempt_count: 3, correct_count: 2)
      # User2: box_level 0, 4 attempts, 4 correct → 100%
      create(:user_question_state, user: user2, question: question2, box_level: 0, attempt_count: 4, correct_count: 4)

      result = described_class.retention_decay_curves
      box0 = result.find { |r| r[:box_level] == 0 }

      expect(box0[:user_count]).to eq(2)
      expect(box0[:mean_retention]).to be_between(80.0, 90.0)
      expect(box0[:std_dev]).to be > 0
      expect(box0[:min_retention]).to be < box0[:max_retention]
    end

    it 'excludes users with fewer than 3 attempts' do
      create(:user_question_state, user: user, question: question, box_level: 1, attempt_count: 2, correct_count: 1)

      result = described_class.retention_decay_curves
      box1 = result.find { |r| r[:box_level] == 1 }
      expect(box1[:user_count]).to eq(0)
    end
  end

  describe '.call' do
    it 'returns all expected keys' do
      result = described_class.call
      expect(result).to include(
        :box_distribution,
        :retention_by_box,
        :time_to_mastery,
        :retention_decay,
        :fixed_interval_critique
      )
    end
  end
end
