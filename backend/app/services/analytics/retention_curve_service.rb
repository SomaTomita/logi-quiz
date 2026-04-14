# SRS固定間隔の限界を統計的に証明するサービス
# 各ボックスレベルでのユーザー間retention varianceを計算し、
# 固定間隔[1,3,7,14,30]日が個人の記憶定着パターンに適応できないことを示す
module Analytics
  class RetentionCurveService
    FIXED_INTERVALS = SrsService::REVIEW_INTERVALS # [1, 3, 7, 14, 30]
    MIN_SAMPLE_SIZE = 5 # varianceを計算するために必要な最小ユーザー数

    def self.call
      decay = retention_decay_curves
      {
        box_distribution: box_level_distribution,
        retention_by_box: retention_rate_per_box,
        time_to_mastery: time_to_mastery_analysis,
        retention_decay: decay,
        fixed_interval_critique: fixed_interval_critique(decay)
      }
    end

    def self.box_level_distribution
      total = UserQuestionState.count
      return [] if total.zero?

      # total.to_i ensures only integer values are interpolated into SQL
      UserQuestionState.group(:box_level)
                       .select(
                         'box_level',
                         'COUNT(*) AS count',
                         Arel.sql("ROUND(COUNT(*) * 100.0 / #{total.to_i}, 1) AS percentage")
                       )
                       .order(:box_level)
                       .map { |r| r.attributes.except('id') }
    end

    # Single grouped query instead of N+1 per box level
    def self.retention_rate_per_box
      rows = UserQuestionState
        .group(:box_level)
        .select(
          'box_level',
          'COUNT(*) AS state_count',
          'SUM(attempt_count) AS total_attempts',
          'SUM(correct_count) AS total_correct'
        )
        .index_by(&:box_level)

      (0..4).map do |level|
        row = rows[level]
        total_a = row&.total_attempts.to_i
        total_c = row&.total_correct.to_i
        state_count = row&.state_count.to_i
        {
          box_level: level,
          total_states: state_count,
          avg_attempts: state_count.positive? ? (total_a.to_f / state_count).round(1) : 0,
          retention_rate: total_a.positive? ? (total_c.to_f / total_a * 100).round(1) : 0.0,
          expected_interval_days: FIXED_INTERVALS.fetch(level, nil)
        }
      end
    end

    def self.time_to_mastery_analysis
      # Single SQL JOIN instead of Ruby-side join
      rows = UserQuestionState
        .where(box_level: 4)
        .joins('INNER JOIN question_attempts ON question_attempts.user_id = user_question_states.user_id ' \
               'AND question_attempts.question_id = user_question_states.question_id')
        .group('user_question_states.user_id', 'user_question_states.question_id')
        .pluck(
          Arel.sql('DATEDIFF(DATE(user_question_states.last_reviewed_at), DATE(MIN(question_attempts.created_at)))')
        )

      durations = rows.compact.select(&:positive?)
      return { avg_days: nil, median_days: nil, distribution: [] } if durations.empty?

      sorted = durations.sort
      {
        avg_days: (durations.sum.to_f / durations.length).round(1),
        median_days: sorted[sorted.length / 2],
        min_days: sorted.first,
        max_days: sorted.last,
        std_dev: std_dev(durations.map(&:to_f)).round(1),
        distribution: histogram(durations, bin_size: 7)
      }
    end

    def self.retention_decay_curves
      # Single query: per-user retention grouped by box_level, then aggregate in Ruby for std_dev
      per_user = UserQuestionState
        .where('attempt_count >= ?', 3)
        .group(:box_level, :user_id)
        .select(
          'box_level',
          'ROUND(SUM(correct_count) * 100.0 / SUM(attempt_count), 1) AS user_retention'
        )

      grouped = per_user.group_by(&:box_level)

      (0..4).map do |level|
        retentions = (grouped[level] || []).map { |r| r.user_retention.to_f }

        if retentions.empty?
          next {
            box_level: level,
            fixed_interval_days: FIXED_INTERVALS.fetch(level, nil),
            user_count: 0,
            mean_retention: 0.0,
            std_dev: 0.0,
            min_retention: 0.0,
            max_retention: 0.0
          }
        end

        {
          box_level: level,
          fixed_interval_days: FIXED_INTERVALS.fetch(level, nil),
          user_count: retentions.length,
          mean_retention: (retentions.sum / retentions.length).round(1),
          std_dev: std_dev(retentions).round(1),
          min_retention: retentions.min.round(1),
          max_retention: retentions.max.round(1)
        }
      end
    end

    # decay_data is passed from call() to avoid double computation
    def self.fixed_interval_critique(decay_data)
      high_variance_levels = decay_data.select { |d| d[:std_dev] > 15.0 && d[:user_count] >= MIN_SAMPLE_SIZE }

      {
        fixed_intervals: FIXED_INTERVALS,
        variance_by_level: decay_data.map { |d| { box_level: d[:box_level], std_dev: d[:std_dev] } },
        high_variance_count: high_variance_levels.length,
        conclusion: build_conclusion(high_variance_levels)
      }
    end

    class << self
      private

      def build_conclusion(high_variance_levels)
        if high_variance_levels.length >= 2
          "High retention variance (std_dev > 15%) observed at #{high_variance_levels.length}/5 box levels. " \
            "Fixed intervals of #{FIXED_INTERVALS} days cannot adapt to this diversity. " \
            'An adaptive algorithm should adjust intervals based on individual retention patterns.'
        else
          'Retention variance is moderate. More data needed to evaluate adaptive SRS benefits.'
        end
      end

      def std_dev(values)
        return 0.0 if values.length < 2

        mean = values.sum / values.length.to_f
        variance = values.sum { |v| (v - mean)**2 } / (values.length - 1).to_f
        Math.sqrt(variance)
      end

      def histogram(values, bin_size:)
        return [] if values.empty?

        # O(N) bucket assignment instead of O(N*M) per-bin scan
        counts = Hash.new(0)
        values.each { |v| counts[v / bin_size] += 1 }

        max_bucket = values.max / bin_size
        (0..max_bucket).map do |bucket|
          start = bucket * bin_size
          { range: "#{start}-#{start + bin_size - 1}", count: counts[bucket] }
        end
      end
    end
  end
end
