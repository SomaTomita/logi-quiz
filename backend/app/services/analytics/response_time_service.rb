module Analytics
  class ResponseTimeService
    def self.call(section_id: nil, bin_size_ms: 1000)
      {
        histogram: response_time_histogram(section_id: section_id, bin_size_ms: bin_size_ms),
        by_section: per_section_comparison,
        correctness_correlation: correctness_vs_speed
      }
    end

    def self.response_time_histogram(section_id: nil, bin_size_ms: 1000)
      bin = Integer(bin_size_ms)
      scope = QuestionAttempt.where.not(response_time_ms: nil)
      scope = scope.joins(:question).where(questions: { section_id: section_id }) if section_id

      rows = scope
        .select(Arel.sql("FLOOR(response_time_ms / #{bin}) AS bin_num, COUNT(*) AS count"))
        .group(Arel.sql("FLOOR(response_time_ms / #{bin})"))
        .order(Arel.sql('bin_num ASC'))

      rows.map do |r|
        bin_num = r.bin_num.to_i
        { 'bin_start' => bin_num * bin, 'bin_end' => (bin_num + 1) * bin, 'count' => r.count }
      end
    end

    def self.per_section_comparison
      QuestionAttempt.joins(question: :section)
                     .where.not(response_time_ms: nil)
                     .group('sections.id', 'sections.section_name')
                     .select(
                       'sections.id AS section_id',
                       'sections.section_name',
                       'ROUND(AVG(response_time_ms), 0) AS avg_ms',
                       'ROUND(MIN(response_time_ms), 0) AS min_ms',
                       'ROUND(MAX(response_time_ms), 0) AS max_ms',
                       'COUNT(*) AS attempt_count'
                     )
                     .order('avg_ms ASC')
                     .map { |r| r.attributes.except('id') }
    end

    def self.correctness_vs_speed
      # Compute quartile boundaries in SQL to avoid loading all rows into memory
      total = QuestionAttempt.where.not(response_time_ms: nil).count
      return [] if total.zero?

      offsets = [total / 4, total / 2, 3 * total / 4]
      q1, q2, q3 = offsets.map do |offset|
        QuestionAttempt.where.not(response_time_ms: nil)
                       .order(:response_time_ms)
                       .offset(offset).limit(1)
                       .pick(:response_time_ms)
      end

      # Single conditional aggregation query instead of 8 separate queries
      rows = QuestionAttempt
        .where.not(response_time_ms: nil)
        .pick(
          Arel.sql("SUM(CASE WHEN response_time_ms <= #{Integer(q1)} THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms <= #{Integer(q1)} AND correct THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms BETWEEN #{Integer(q1) + 1} AND #{Integer(q2)} THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms BETWEEN #{Integer(q1) + 1} AND #{Integer(q2)} AND correct THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms BETWEEN #{Integer(q2) + 1} AND #{Integer(q3)} THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms BETWEEN #{Integer(q2) + 1} AND #{Integer(q3)} AND correct THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms > #{Integer(q3)} THEN 1 ELSE 0 END)"),
          Arel.sql("SUM(CASE WHEN response_time_ms > #{Integer(q3)} AND correct THEN 1 ELSE 0 END)")
        )

      values = Array(rows).map(&:to_i)
      labels = [
        "0-#{q1}ms",
        "#{q1 + 1}-#{q2}ms",
        "#{q2 + 1}-#{q3}ms",
        "#{q3 + 1}ms+"
      ]

      labels.each_with_index.map do |label, i|
        bucket_total = values[i * 2]
        bucket_correct = values[i * 2 + 1]
        accuracy = bucket_total.positive? ? (bucket_correct.to_f / bucket_total * 100).round(1) : 0.0
        {
          speed_bucket: label,
          total_attempts: bucket_total,
          accuracy_rate: accuracy
        }
      end
    end
  end
end
