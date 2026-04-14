require 'rails_helper'

RSpec.describe Analytics::EngagementService do
  let(:user) { create(:user) }

  describe '.study_time_distribution' do
    it 'returns all 5 bins with zero counts when no logs exist' do
      result = described_class.study_time_distribution
      expect(result.length).to eq(5)
      expect(result.map { |r| r[:range] }).to eq(%w[1-5 6-10 11-20 21-30 31+])
      result.each { |r| expect(r[:count]).to eq(0) }
    end

    it 'bins study times correctly' do
      create(:study_log, user: user, study_time: 3, date: 1.day.ago)
      create(:study_log, user: user, study_time: 8, date: 2.days.ago)
      create(:study_log, user: user, study_time: 15, date: 3.days.ago)
      create(:study_log, user: user, study_time: 25, date: 4.days.ago)
      create(:study_log, user: user, study_time: 40, date: 5.days.ago)

      result = described_class.study_time_distribution
      counts = result.map { |r| r[:count] }
      expect(counts).to eq([1, 1, 1, 1, 1])
    end

    it 'counts multiple logs in the same bin' do
      create(:study_log, user: user, study_time: 2, date: 1.day.ago)
      user2 = create(:user)
      create(:study_log, user: user2, study_time: 4, date: 1.day.ago)

      result = described_class.study_time_distribution
      bin_1_5 = result.find { |r| r[:range] == '1-5' }
      expect(bin_1_5[:count]).to eq(2)
    end
  end

  describe '.active_users_trend' do
    it 'returns empty array when no logs exist' do
      expect(described_class.active_users_trend('monthly')).to eq([])
    end

    it 'groups by period and counts distinct users' do
      user2 = create(:user)
      create(:study_log, user: user, study_time: 5, date: Date.today)
      create(:study_log, user: user2, study_time: 10, date: Date.today)

      result = described_class.active_users_trend('daily')
      expect(result.length).to be >= 1

      today_row = result.last
      expect(today_row['active_users']).to eq(2)
    end
  end

  describe '.call' do
    it 'returns all expected keys' do
      result = described_class.call
      expect(result).to include(:active_users, :study_time_distribution, :session_duration_trend)
    end

    it 'accepts valid periods' do
      %w[daily weekly monthly].each do |period|
        result = described_class.call(period: period)
        expect(result).to include(:active_users)
      end
    end
  end
end
