require 'rails_helper'

RSpec.describe Analytics::TopicAccuracyService do
  let(:user) { create(:user) }
  let(:section) { create(:section) }
  let(:question) { create(:question, section: section) }

  describe '.current_accuracy' do
    it 'returns empty array when no attempts exist' do
      expect(described_class.current_accuracy).to eq([])
    end

    it 'computes accuracy per section using SUM(correct)' do
      create(:question_attempt, :correct, user: user, question: question, response_time_ms: 2000)
      create(:question_attempt, user: user, question: question, correct: false, response_time_ms: 3000)

      result = described_class.current_accuracy
      expect(result.length).to eq(1)
      expect(result.first['accuracy_rate']).to eq(50.0)
      expect(result.first['total_attempts']).to eq(2)
      expect(result.first['section_name']).to eq(section.section_name)
    end

    it 'filters by section_id when provided' do
      other_section = create(:section)
      other_question = create(:question, section: other_section)

      create(:question_attempt, :correct, user: user, question: question, response_time_ms: 1000)
      create(:question_attempt, :correct, user: user, question: other_question, response_time_ms: 1000)

      result = described_class.current_accuracy(section_id: section.id)
      expect(result.length).to eq(1)
      expect(result.first['section_name']).to eq(section.section_name)
    end
  end

  describe '.accuracy_trend' do
    it 'returns empty array when no attempts exist' do
      expect(described_class.accuracy_trend).to eq([])
    end

    it 'groups by period and section' do
      create(:question_attempt, :correct, user: user, question: question, response_time_ms: 1000, created_at: 1.day.ago)
      create(:question_attempt, user: user, question: question, correct: false, response_time_ms: 1000, created_at: 1.day.ago)

      result = described_class.accuracy_trend(period: 'daily')
      expect(result.length).to be >= 1
      expect(result.first['accuracy_rate']).to eq(50.0)
    end
  end

  describe '.call' do
    it 'returns current and trend data' do
      result = described_class.call
      expect(result).to include(:current, :trend)
      expect(result[:current]).to be_an(Array)
      expect(result[:trend]).to be_an(Array)
    end

    it 'accepts all valid periods' do
      %w[daily weekly monthly].each do |period|
        result = described_class.call(period: period)
        expect(result[:trend]).to be_an(Array)
      end
    end
  end
end
