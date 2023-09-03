FactoryBot.define do
    factory :user_section do
      user
      section
      cleared_at { rand(365.days.ago..Time.now) }
      correct_answers_count { rand(1..10) }
    end
end