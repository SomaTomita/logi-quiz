module Analytics
  class EngagementService
    def self.call(period: 'monthly')
      {
        active_users: active_users_trend(period),
        study_time_distribution: study_time_distribution,
        session_duration_trend: session_duration_trend(period)
      }
    end

    def self.active_users_trend(period)
      date_trunc = date_trunc_sql(period)

      StudyLog.where('date >= ?', trend_lookback(period))
              .group(date_trunc)
              .select(
                "#{date_trunc} AS period_start",
                'COUNT(DISTINCT user_id) AS active_users',
                'SUM(study_time) AS total_study_time',
                'ROUND(AVG(study_time), 1) AS avg_study_time'
              )
              .order('period_start ASC')
              .map { |r| r.attributes.except('id') }
    end

    def self.study_time_distribution
      # Single CASE query instead of 5 separate COUNT queries
      row = StudyLog.pick(
        Arel.sql("SUM(CASE WHEN study_time BETWEEN 1 AND 5 THEN 1 ELSE 0 END)"),
        Arel.sql("SUM(CASE WHEN study_time BETWEEN 6 AND 10 THEN 1 ELSE 0 END)"),
        Arel.sql("SUM(CASE WHEN study_time BETWEEN 11 AND 20 THEN 1 ELSE 0 END)"),
        Arel.sql("SUM(CASE WHEN study_time BETWEEN 21 AND 30 THEN 1 ELSE 0 END)"),
        Arel.sql("SUM(CASE WHEN study_time >= 31 THEN 1 ELSE 0 END)")
      )

      counts = Array(row).map(&:to_i)
      labels = %w[1-5 6-10 11-20 21-30 31+]

      labels.zip(counts).map { |label, count| { range: label, count: count } }
    end

    def self.session_duration_trend(period)
      date_trunc = date_trunc_sql(period)

      StudyLog.where('date >= ?', trend_lookback(period))
              .group(date_trunc)
              .select(
                "#{date_trunc} AS period_start",
                'ROUND(AVG(study_time), 1) AS avg_study_time',
                'MAX(study_time) AS max_study_time',
                'MIN(study_time) AS min_study_time'
              )
              .order('period_start ASC')
              .map { |r| r.attributes.except('id') }
    end

    class << self
      private

      def date_trunc_sql(period)
        case period
        when 'daily'   then 'DATE(study_logs.date)'
        when 'weekly'  then "DATE(DATE_SUB(study_logs.date, INTERVAL WEEKDAY(study_logs.date) DAY))"
        when 'monthly' then "DATE_FORMAT(study_logs.date, '%Y-%m-01')"
        else "DATE_FORMAT(study_logs.date, '%Y-%m-01')"
        end
      end

      def trend_lookback(period)
        case period
        when 'daily'   then 30.days.ago
        when 'weekly'  then 12.weeks.ago
        when 'monthly' then 12.months.ago
        else 6.months.ago
        end
      end
    end
  end
end
