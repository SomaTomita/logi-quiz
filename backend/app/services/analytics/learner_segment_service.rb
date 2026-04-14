# 学習者を4セグメントに分類し、同じ固定SRS間隔が
# セグメントごとに異なる結果をもたらすことを示すサービス
module Analytics
  class LearnerSegmentService
    ACCURACY_THRESHOLD = 70.0
    SPEED_THRESHOLD_MS = 5000

    SEGMENTS = {
      fast_accurate:   { label: 'Fast & Accurate',   description: 'Quick responses with high accuracy' },
      slow_accurate:   { label: 'Slow & Accurate',   description: 'Deliberate responses with high accuracy' },
      fast_inaccurate: { label: 'Fast & Inaccurate', description: 'Quick responses but low accuracy' },
      struggling:      { label: 'Struggling',         description: 'Slow responses with low accuracy' }
    }.freeze

    # Single computation of segment_users, passed to all sub-methods
    def self.call
      users = segment_users
      {
        segments: users.map { |u| u.except(:user_id) },
        segment_summary: segment_summary(users),
        srs_impact_by_segment: srs_impact_by_segment(users)
      }
    end

    def self.segment_users
      QuestionAttempt
        .group(:user_id)
        .having('COUNT(*) >= ?', 10)
        .select(
          'user_id',
          'COUNT(*) AS total_attempts',
          'ROUND(SUM(correct) * 100.0 / COUNT(*), 1) AS accuracy',
          'ROUND(AVG(response_time_ms), 0) AS avg_response_ms'
        )
        .map do |stat|
          segment = classify(stat.accuracy.to_f, stat.avg_response_ms.to_i)
          {
            user_id: stat.user_id, # internal only — stripped before API response
            total_attempts: stat.total_attempts,
            accuracy: stat.accuracy.to_f,
            avg_response_ms: stat.avg_response_ms.to_i,
            segment: segment,
            segment_label: SEGMENTS[segment][:label]
          }
        end
    end

    def self.segment_summary(users)
      SEGMENTS.map do |key, meta|
        segment_list = users.select { |u| u[:segment] == key }
        {
          segment: key,
          label: meta[:label],
          description: meta[:description],
          user_count: segment_list.length,
          avg_accuracy: avg_of(segment_list, :accuracy),
          avg_response_ms: avg_of(segment_list, :avg_response_ms).to_i
        }
      end
    end

    # Single grouped query per segment instead of N+1
    def self.srs_impact_by_segment(users)
      grouped = users.group_by { |u| u[:segment] }

      grouped.map do |segment, segment_list|
        user_ids = segment_list.map { |u| u[:user_id] }

        stats = UserQuestionState
          .where(user_id: user_ids)
          .group(:box_level)
          .select(
            'box_level',
            'COUNT(*) AS cnt',
            'SUM(attempt_count) AS total_a',
            'SUM(correct_count) AS total_c'
          )
          .index_by(&:box_level)

        box_retention = (0..4).map do |level|
          row = stats[level]
          total_a = row&.total_a.to_i
          total_c = row&.total_c.to_i
          {
            box_level: level,
            retention: total_a.positive? ? (total_c.to_f / total_a * 100).round(1) : nil,
            count: row&.cnt.to_i
          }
        end

        box_dist = stats.transform_values { |v| v.cnt.to_i }

        {
          segment: segment,
          label: SEGMENTS[segment][:label],
          user_count: segment_list.length,
          box_distribution: box_dist,
          retention_by_box: box_retention
        }
      end
    end

    class << self
      private

      def classify(accuracy, avg_response_ms)
        fast = avg_response_ms <= SPEED_THRESHOLD_MS
        accurate = accuracy >= ACCURACY_THRESHOLD

        if fast && accurate     then :fast_accurate
        elsif !fast && accurate then :slow_accurate
        elsif fast && !accurate then :fast_inaccurate
        else                         :struggling
        end
      end

      def avg_of(list, key)
        return 0.0 if list.empty?

        list.sum { |u| u[key].to_f } / list.length
      end
    end
  end
end
