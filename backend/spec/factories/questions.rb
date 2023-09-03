FactoryBot.define do
    factory :question do
      sequence(:question_text) { |n| "問題文#{n}" }

      after(:create) do |question|
        # 3つの間違った選択肢を作成
        create_list(:choice, 3, question: question, is_correct: false)
        
        # 1つの正しい選択肢を作成
        create(:choice, question: question, is_correct: true)
      end

      after(:create) do |question|
        create(:explanation, question: question)
      end

      section
    end
end