require 'rails_helper'

RSpec.describe Admin::QuizzesController, type: :request do
  let(:admin_user) { create(:user, :admin) }
  let(:section) { create(:section) }
  let(:question) { create(:question, section: section) }

  
  before do
    admin_user.confirm
    post "/auth/sign_in", params: { email: admin_user.email, password: 'password' }
    @auth_headers = response.headers.slice('access-token', 'client', 'uid')
  end
  

  describe "PUT #update" do
    let(:valid_attributes) do
      {
        quiz: {
          question_text: "Updated question text",
          choices_attributes: [
            { id: question.choices.first.id, choice_text: "Updated choice text", is_correct: true },
          ],
          explanation_attributes: { id: question.explanation.id, explanation_text: "Updated explanation text" }
        }
      }
    end

    let(:invalid_attributes) do
        {
          quiz: {
            question_text: "",
            choices_attributes: [
              { id: question.choices.first.id, choice_text: "", is_correct: true },
            ],
            explanation_attributes: { id: question.explanation.id, explanation_text: "" }
          }
        }
    end
      


    context "有効なパラメータの場合" do
      before do
        # paramsで送信するパラメータを指定 / headersにはリクエストヘッダーに認証情報を含める
        put "/admin/sections/#{section.id}/quizzes/#{question.id}", params: valid_attributes, headers: @auth_headers
      end

      it "質問を正しく更新する" do
        question.reload
        expect(question.question_text).to eq("Updated question text")
      end

      it "関連する選択肢と説明も正しく更新する" do
        question.reload
        expect(question.choices.first.choice_text).to eq("Updated choice text")
        expect(question.explanation.explanation_text).to eq("Updated explanation text")
      end
    end

    context "無効なパラメータの場合" do
      before do
        put "/admin/sections/#{section.id}/quizzes/#{question.id}", params: invalid_attributes, headers: @auth_headers
      end

      it "質問のテキストは空に更新されない" do
        question.reload
        expect(question.question_text).not_to eq("")
      end

      it "選択肢のテキストは空に更新されない" do
        question.reload
        expect(question.choices.first.choice_text).not_to eq("")
      end
    
      it "説明のテキストは空に更新されない" do
        question.reload
        expect(question.explanation.explanation_text).not_to eq("")
      end

      end
    end


  describe "DELETE #destroy" do
    before do
      @question_id = question.id
      @choice_ids = question.choices.map(&:id)
      @explanation_id = question.explanation.id
  
      delete "/admin/sections/#{section.id}/quizzes/#{question.id}", headers: @auth_headers
    end
  
    it "指定された質問を正しく削除する" do
      expect { Question.find(@question_id) }.to raise_error(ActiveRecord::RecordNotFound)
    end
  
    it "関連する選択肢も正しく削除される" do
      expect(Choice.where(id: @choice_ids)).not_to exist
    end
  
    it "関連する説明も正しく削除される" do
      expect(Explanation.where(id: @explanation_id)).not_to exist
    end 
   end
end
