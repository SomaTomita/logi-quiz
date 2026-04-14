require 'rails_helper'

RSpec.describe Analytics::LearnerSegmentService do
  let(:user) { create(:user) }
  let(:section) { create(:section) }
  let(:question) { create(:question, section: section) }

  describe '.call' do
    it 'returns all expected keys' do
      result = described_class.call
      expect(result).to include(:segments, :segment_summary, :srs_impact_by_segment)
    end

    it 'does not expose user_id in segments response' do
      15.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: 2000) }

      result = described_class.call
      result[:segments].each do |segment|
        expect(segment).not_to have_key(:user_id)
      end
    end
  end

  describe '.segment_users' do
    it 'excludes users with fewer than 10 attempts' do
      5.times { create(:question_attempt, user: user, question: question, response_time_ms: 2000) }

      result = described_class.segment_users
      expect(result).to be_empty
    end

    it 'classifies fast & accurate users correctly' do
      15.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: 2000) }

      result = described_class.segment_users
      expect(result.length).to eq(1)
      expect(result.first[:segment]).to eq(:fast_accurate)
    end

    it 'classifies slow & accurate users correctly' do
      15.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: 8000) }

      result = described_class.segment_users
      expect(result.first[:segment]).to eq(:slow_accurate)
    end

    it 'classifies fast & inaccurate users correctly' do
      15.times { create(:question_attempt, user: user, question: question, correct: false, response_time_ms: 2000) }

      result = described_class.segment_users
      expect(result.first[:segment]).to eq(:fast_inaccurate)
    end

    it 'classifies struggling users correctly' do
      15.times { create(:question_attempt, user: user, question: question, correct: false, response_time_ms: 8000) }

      result = described_class.segment_users
      expect(result.first[:segment]).to eq(:struggling)
    end
  end

  describe '.segment_summary' do
    it 'returns 4 segments even with no data' do
      users = described_class.segment_users
      result = described_class.segment_summary(users)
      expect(result.length).to eq(4)
      expect(result.map { |s| s[:segment] }).to contain_exactly(:fast_accurate, :slow_accurate, :fast_inaccurate, :struggling)
    end
  end

  describe '.srs_impact_by_segment' do
    it 'returns box-level retention per segment' do
      15.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: 2000) }
      create(:user_question_state, user: user, question: question, box_level: 2, attempt_count: 10, correct_count: 7)

      users = described_class.segment_users
      result = described_class.srs_impact_by_segment(users)

      expect(result.length).to eq(1)
      expect(result.first[:retention_by_box].length).to eq(5)
    end
  end
end
