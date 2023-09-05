require 'rails_helper'

RSpec.describe "Quizzes", type: :request do
  describe "GET /index" do
    let!(:section) { create(:section) }
    let!(:questions) { create_list(:question, 10, section: section) } # 事前に上記で作成したセクションに属する問題を10個作成

    before do
      get "/sections/#{section.id}/quizzes"
    end

    it "10のクイズを返す" do
      expect(JSON.parse(response.body).size).to eq(10)
    end

    it "選択肢と説明を含むクイズを返す" do
      quiz = JSON.parse(response.body).first
      expect(quiz).to include("question_text")
      expect(quiz).to include("choices")
      expect(quiz["choices"].size).to eq(4)
      expect(quiz).to include("explanation")
    end
  end
end
