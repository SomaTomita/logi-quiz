require 'rails_helper'

RSpec.describe Question, type: :model do
  describe "アソシエーション" do

    it '問題が削除された場合、関連するchoicesも全て削除される' do
      question = create(:question)
      # questionを削除したときに、Choiceの数が-4に変わる
      expect { question.destroy }.to change { Choice.count }.by(-4)
    end

    it '問題が削除された場合、関連するexplanationも削除される' do
      question = create(:question)
      # questionを削除したときに、Explanationの数が-1に変わる
      expect { question.destroy }.to change { Explanation.count }.by(-1)
    end
end

 describe "ネストされた属性" do
    it "choicesに対してネストされた属性を許可する" do
      # buildメソッドを使用してQuestionオブジェクトを作成
      question = build(:question, choices_attributes: [choice_text: "選択肢1", is_correct: true])
      # 作成したquestionの最初のchoiceのテキストが"選択肢1"であること
      expect(question.choices.first.choice_text).to eq("選択肢1")
      expect(question.choices.first.is_correct).to eq(true)
    end
  
    it "explanationに対してネストされた属性を許可する" do
      # buildメソッドを使用してQuestionオブジェクトを作成
      question = build(:question, explanation_attributes: {explanation_text: "解説文1"})
      # 作成したquestionのexplanationのテキストが"解説文1"であること
      expect(question.explanation.explanation_text).to eq("解説文1")
    end
  end
  
end
