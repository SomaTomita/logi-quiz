class Admin::AnalyticsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin

  VALID_PERIODS = %w[daily weekly monthly].freeze

  # GET /admin/analytics/overview
  def overview
    render json: {
      data: Rails.cache.fetch('admin/analytics/overview', expires_in: 15.minutes) {
        row = QuestionAttempt.pick(
          Arel.sql('COUNT(*)'),
          Arel.sql('SUM(correct)')
        )
        total_attempts, correct_count = Array(row).map(&:to_i)
        accuracy = total_attempts.positive? ? (correct_count.to_f / total_attempts * 100).round(1) : 0.0

        srs_total = UserQuestionState.count
        mastery = srs_total.positive? ? (UserQuestionState.where(box_level: 4).count.to_f / srs_total * 100).round(1) : 0.0

        {
          total_users: User.count,
          active_users_7d: active_user_count(7),
          active_users_30d: active_user_count(30),
          total_attempts: total_attempts,
          overall_accuracy: accuracy,
          avg_response_time_ms: QuestionAttempt.where.not(response_time_ms: nil).average(:response_time_ms)&.round(0),
          questions_in_srs: srs_total,
          mastery_rate: mastery
        }
      }
    }
  end

  # GET /admin/analytics/topic_accuracy?period=weekly&locale=en
  def topic_accuracy
    period = validated_period
    locale = validated_locale
    cache_key = "admin/analytics/topic_accuracy/#{period}/#{params[:section_id].to_i}/#{locale}"

    render json: {
      data: Rails.cache.fetch(cache_key, expires_in: 10.minutes) {
        Analytics::TopicAccuracyService.call(
          period: period,
          section_id: params[:section_id],
          locale: locale
        )
      }
    }
  end

  # GET /admin/analytics/engagement?period=monthly
  def engagement
    period = validated_period('monthly')
    cache_key = "admin/analytics/engagement/#{period}"

    render json: {
      data: Rails.cache.fetch(cache_key, expires_in: 30.minutes) {
        Analytics::EngagementService.call(period: period)
      }
    }
  end

  # GET /admin/analytics/response_times?section_id=3&bin_size=1000
  def response_times
    raw = params[:bin_size]
    bin_size = raw.blank? ? 1000 : [[raw.to_i, 100].max, 10_000].min
    cache_key = "admin/analytics/response_times/#{params[:section_id].to_i}/#{bin_size}"

    render json: {
      data: Rails.cache.fetch(cache_key, expires_in: 15.minutes) {
        Analytics::ResponseTimeService.call(
          section_id: params[:section_id],
          bin_size_ms: bin_size
        )
      }
    }
  end

  # GET /admin/analytics/retention_curves
  def retention_curves
    render json: {
      data: Rails.cache.fetch('admin/analytics/retention_curves', expires_in: 30.minutes) {
        Analytics::RetentionCurveService.call
      }
    }
  end

  # GET /admin/analytics/learner_segments
  def learner_segments
    render json: {
      data: Rails.cache.fetch('admin/analytics/learner_segments', expires_in: 30.minutes) {
        Analytics::LearnerSegmentService.call
      }
    }
  end

  private

  def validated_period(default = 'weekly')
    VALID_PERIODS.include?(params[:period]) ? params[:period] : default
  end

  def validated_locale
    %w[ja en].include?(params[:locale]) ? params[:locale] : 'ja'
  end

  def active_user_count(days)
    QuestionAttempt.where('created_at >= ?', days.days.ago)
                   .distinct.count(:user_id)
  end
end
