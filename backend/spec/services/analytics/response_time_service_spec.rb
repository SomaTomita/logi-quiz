require 'rails_helper'

RSpec.describe Analytics::ResponseTimeService do
  let(:user) { create(:user) }
  let(:section) { create(:section) }
  let(:question) { create(:question, section: section) }

  describe '.response_time_histogram' do
    it 'returns empty array when no attempts exist' do
      result = described_class.response_time_histogram
      expect(result).to eq([])
    end

    it 'bins response times correctly' do
      create(:question_attempt, user: user, question: question, response_time_ms: 500)
      create(:question_attempt, user: user, question: question, response_time_ms: 1500)
      create(:question_attempt, user: user, question: question, response_time_ms: 1800)

      result = described_class.response_time_histogram(bin_size_ms: 1000)
      bin_0 = result.find { |b| b['bin_start'] == 0 }
      bin_1 = result.find { |b| b['bin_start'] == 1000 }

      expect(bin_0['count']).to eq(1)
      expect(bin_1['count']).to eq(2)
    end

    it 'filters by section_id when provided' do
      other_section = create(:section)
      other_question = create(:question, section: other_section)

      create(:question_attempt, user: user, question: question, response_time_ms: 1000)
      create(:question_attempt, user: user, question: other_question, response_time_ms: 2000)

      result = described_class.response_time_histogram(section_id: section.id)
      total_count = result.sum { |b| b['count'] }
      expect(total_count).to eq(1)
    end

    it 'skips attempts with nil response_time_ms' do
      create(:question_attempt, user: user, question: question, response_time_ms: nil)
      create(:question_attempt, user: user, question: question, response_time_ms: 500)

      result = described_class.response_time_histogram
      total_count = result.sum { |b| b['count'] }
      expect(total_count).to eq(1)
    end

    it 'raises on non-integer bin_size_ms' do
      expect { described_class.response_time_histogram(bin_size_ms: 'abc') }.to raise_error(ArgumentError)
    end
  end

  describe '.per_section_comparison' do
    it 'returns empty array when no attempts exist' do
      expect(described_class.per_section_comparison).to eq([])
    end

    it 'aggregates stats per section' do
      create(:question_attempt, user: user, question: question, response_time_ms: 2000)
      create(:question_attempt, user: user, question: question, response_time_ms: 4000)

      result = described_class.per_section_comparison
      expect(result.length).to eq(1)
      expect(result.first['avg_ms']).to eq(3000)
      expect(result.first['attempt_count']).to eq(2)
      expect(result.first['section_name']).to eq(section.section_name)
    end
  end

  describe '.correctness_vs_speed' do
    it 'returns empty array when no attempts exist' do
      expect(described_class.correctness_vs_speed).to eq([])
    end

    it 'computes quartile-based buckets with accuracy rates' do
      # Create 8 attempts with known response times and correctness
      (1..8).each do |i|
        create(:question_attempt,
               user: user,
               question: question,
               response_time_ms: i * 1000,
               correct: i <= 4) # first 4 correct, last 4 incorrect
      end

      result = described_class.correctness_vs_speed
      expect(result.length).to eq(4)
      expect(result).to all(include(:speed_bucket, :total_attempts, :accuracy_rate))

      total = result.sum { |b| b[:total_attempts] }
      expect(total).to eq(8)
    end

    it 'handles all-correct attempts' do
      4.times { create(:question_attempt, :correct, user: user, question: question, response_time_ms: rand(1000..5000)) }

      result = described_class.correctness_vs_speed
      result.each do |bucket|
        next if bucket[:total_attempts].zero?

        expect(bucket[:accuracy_rate]).to eq(100.0)
      end
    end
  end

  describe '.call' do
    it 'returns all three keys' do
      result = described_class.call
      expect(result).to include(:histogram, :by_section, :correctness_correlation)
    end
  end
end
