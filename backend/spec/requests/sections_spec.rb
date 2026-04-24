require 'rails_helper'

RSpec.describe "Sections API", type: :request do
  describe "GET /sections" do
    let!(:ja_sections) { create_list(:section, 3, locale: "ja") }
    let!(:en_sections) { create_list(:section, 2, locale: "en") }

    context "without locale param (defaults to ja)" do
      before { get '/sections' }

      it "全てのJAセクションを含む" do
        ids = JSON.parse(response.body).map { |s| s['id'] }
        ja_section_ids = ja_sections.map(&:id)
        expect(ids).to include(*ja_section_ids)
      end

      it "ENセクションを含まない" do
        ids = JSON.parse(response.body).map { |s| s['id'] }
        en_section_ids = en_sections.map(&:id)
        expect(ids).not_to include(*en_section_ids)
      end
    end

    context "with locale=en" do
      before { get '/sections?locale=en' }

      it "ENセクションのみ返す" do
        ids = JSON.parse(response.body).map { |s| s['id'] }
        en_section_ids = en_sections.map(&:id)
        ja_section_ids = ja_sections.map(&:id)
        expect(ids).to include(*en_section_ids)
        expect(ids).not_to include(*ja_section_ids)
      end
    end

    context "with locale=ja" do
      before { get '/sections?locale=ja' }

      it "JAセクションのみ返す" do
        ids = JSON.parse(response.body).map { |s| s['id'] }
        ja_section_ids = ja_sections.map(&:id)
        en_section_ids = en_sections.map(&:id)
        expect(ids).to include(*ja_section_ids)
        expect(ids).not_to include(*en_section_ids)
      end
    end
  end
end
