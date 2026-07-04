require "rails_helper"

RSpec.describe "Rack::Attack", type: :request do
  before do
    Rack::Attack.enabled = true
    Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new
  end

  after { Rack::Attack.enabled = false }

  describe "POST /auth/sign_in" do
    it "同一IPからの連続リクエストを制限する" do
      6.times do
        post "/auth/sign_in", params: { email: "a@example.com", password: "wrong" }
      end
      expect(response).to have_http_status(:too_many_requests)
    end
  end

  describe "POST /auth/password" do
    it "パスワードリセット要求を制限する" do
      6.times do
        post "/auth/password", params: { email: "a@example.com", redirect_url: "http://localhost:3000" }
      end
      expect(response).to have_http_status(:too_many_requests)
    end
  end
end
