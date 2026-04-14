FactoryBot.define do
  factory :user_question_state do
    user
    question
    box_level { 0 }
    attempt_count { 1 }
    correct_count { 0 }
    last_reviewed_at { Time.current }
    next_review_at { Time.current + SrsService::REVIEW_INTERVALS[0].days }

    trait :mastered do
      box_level { 4 }
      attempt_count { 10 }
      correct_count { 8 }
      next_review_at { Time.current + SrsService::REVIEW_INTERVALS[4].days }
    end

    trait :struggling do
      box_level { 0 }
      attempt_count { 8 }
      correct_count { 2 }
      next_review_at { Time.current + SrsService::REVIEW_INTERVALS[0].days }
    end
  end
end
