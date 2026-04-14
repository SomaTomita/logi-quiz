module Analytics
  class TopicAccuracyService
    def self.call(period: 'weekly', section_id: nil)
      {
        current: current_accuracy(section_id: section_id),
        trend: accuracy_trend(period: period, section_id: section_id)
      }
    end

    def self.current_accuracy(section_id: nil)
      scope = QuestionAttempt.joins(question: :section)
      scope = scope.where(questions: { section_id: section_id }) if section_id

      scope.group('sections.id', 'sections.section_name')
           .select(
             'sections.id AS section_id',
             'sections.section_name',
             'COUNT(*) AS total_attempts',
             'SUM(question_attempts.correct) AS correct_count',
             'ROUND(SUM(question_attempts.correct) * 100.0 / COUNT(*), 1) AS accuracy_rate',
             'ROUND(AVG(question_attempts.response_time_ms), 0) AS avg_response_time_ms'
           )
           .order('accuracy_rate DESC')
           .map { |r| r.attributes.except('id') }
    end

    def self.accuracy_trend(period: 'weekly', section_id: nil)
      date_trunc = date_trunc_sql(period)

      scope = QuestionAttempt.joins(question: :section)
      scope = scope.where(questions: { section_id: section_id }) if section_id
      scope = scope.where('question_attempts.created_at >= ?', trend_start_date(period))

      scope.group(date_trunc, 'sections.id', 'sections.section_name')
           .select(
             "#{date_trunc} AS period_start",
             'sections.id AS section_id',
             'sections.section_name',
             'COUNT(*) AS total_attempts',
             'ROUND(SUM(question_attempts.correct) * 100.0 / COUNT(*), 1) AS accuracy_rate'
           )
           .order('period_start ASC')
           .map { |r| r.attributes.except('id') }
    end

    class << self
      private

      def date_trunc_sql(period)
        case period
        when 'daily'   then 'DATE(question_attempts.created_at)'
        when 'weekly'  then "DATE(DATE_SUB(question_attempts.created_at, INTERVAL WEEKDAY(question_attempts.created_at) DAY))"
        when 'monthly' then "DATE_FORMAT(question_attempts.created_at, '%Y-%m-01')"
        else "DATE(DATE_SUB(question_attempts.created_at, INTERVAL WEEKDAY(question_attempts.created_at) DAY))"
        end
      end

      def trend_start_date(period)
        case period
        when 'daily'   then 30.days.ago
        when 'weekly'  then 12.weeks.ago
        when 'monthly' then 12.months.ago
        else 12.weeks.ago
        end
      end
    end
  end
end
