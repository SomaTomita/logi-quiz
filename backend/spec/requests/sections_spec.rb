require 'rails_helper'

RSpec.describe "Sections API", type: :request do
  describe "GET /sections" do
    # テストデータの作成
    let!(:sections) { create_list(:section, 10) }

    before { get '/sections' }

    it "全てのセクションを取得する" do
      section_json = JSON.parse(response.body)
      expect(section_json).not_to be_empty
      expect(section_json.size).to eq(10)
    end
  end
end
