FactoryBot.define do
    factory :explanation do
      question
      sequence(:explanation_text) { |n| "解説文#{n}" }
    end
end