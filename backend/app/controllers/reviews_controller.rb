# 復習キューAPI
# SRSスケジュールに基づいて復習すべき問題を返却・結果を記録
class ReviewsController < ApplicationController
  before_action :authenticate_user!

  # GET /reviews
  # next_review_at が現在以前の問題を、期限切れが古い順に返却
  def index
    scope = current_user.user_question_states
              .where("next_review_at <= ?", Time.current)
              .includes(question: [:choices, :explanation])
              .order(:next_review_at)

    if params[:section_id].present?
      scope = scope.joins(:question).where(questions: { section_id: params[:section_id] })
    end

    total_due = scope.count
    limit = (params[:limit] || 10).to_i.clamp(1, 50)
    states = scope.limit(limit)

    render json: {
      review_questions: states.map { |state|
        question = state.question
        {
          id: question.id,
          question_text: question.question_text,
          choices: question.choices.map { |c|
            { id: c.id, choice_text: c.choice_text, is_correct: c.is_correct }
          },
          explanation: { explanation_text: question.explanation&.explanation_text },
          box_level: state.box_level,
          attempt_count: state.attempt_count,
          correct_count: state.correct_count
        }
      },
      total_due: total_due
    }
  end

  # POST /reviews/complete
  # 復習セッション結果を記録し、更新後のSRS状態を返却
  def complete
    states = if params[:question_results].present?
              SrsService.record_batch!(user: current_user, question_results: params[:question_results])
            else
              []
            end

    results = states.map do |state|
      {
        question_id: state.question_id,
        box_level: state.box_level,
        next_review_at: state.next_review_at
      }
    end

    render json: { results: results }
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
