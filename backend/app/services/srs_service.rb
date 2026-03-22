class SrsService
  REVIEW_INTERVALS = [1, 3, 7, 14, 30].freeze # days per box level

  def self.record_batch!(user:, question_results:)
    return [] if question_results.blank?

    ActiveRecord::Base.transaction do
      question_results.map do |result|
        record_attempt!(
          user: user,
          question_id: result[:question_id],
          choice_id: result[:choice_id],
          correct: result[:correct],
          response_time_ms: result[:response_time_ms]
        )
      end
    end
  end

  def self.record_attempt!(user:, question_id:, choice_id:, correct:, response_time_ms: nil)
    ActiveRecord::Base.transaction do
      user.question_attempts.create!(
        question_id: question_id,
        choice_id: choice_id,
        correct: correct,
        response_time_ms: response_time_ms
      )

      state = user.user_question_states.find_or_initialize_by(question_id: question_id)
      now = Time.current

      if correct
        state.box_level = [state.box_level + 1, 4].min
      else
        state.box_level = 0
      end

      state.attempt_count += 1
      state.correct_count += 1 if correct
      state.last_reviewed_at = now
      state.next_review_at = now + REVIEW_INTERVALS[state.box_level].days
      state.save!
      state
    end
  end
end
