FactoryBot.define do
  factory :question_attempt do
    user
    question
    choice { nil }
    correct { false }
    response_time_ms { rand(1000..15000) }

    trait :correct do
      correct { true }
    end
  end
end
