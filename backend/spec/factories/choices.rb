FactoryBot.define do
    factory :choice do
      question
      sequence(:choice_text) { |n| "選択肢#{n}" }
      is_correct { false }
    end
end
