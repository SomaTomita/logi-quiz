require 'rails_helper'

RSpec.describe "Auth::Sessions", type: :request do
  describe "GET /index" do

    context "ユーザーがログインしている場合" do
      let(:user) { create(:user) }

      before do
        # Deviseのconfirmableモジュールを使って、ユーザーのメールアドレスの確認をシミュレート (puts response.bodyにより判明)
        user.confirm
        post "/auth/sign_in", params: { email: user.email, password: 'password' }
        # sliceで指定したキーを持つ要素だけを新しいハッシュとして
        @auth_headers = response.headers.slice('access-token', 'client', 'uid')
      end

      it "returns the user's data" do
        get "/auth/sessions", headers: @auth_headers

        # HTTPレスポンスのボディをJSON形式からRubyのハッシュに変換 → 下記の検証をキーや値にアクセスしたテストが可能に
        json = JSON.parse(response.body)
        expect(json['is_login']).to eq(true)
        expect(json['data']['email']).to eq(user.email)
      end
    end


    context "ユーザーがログインしていない場合" do
      it "returns not logged in message" do
        get "/auth/sessions"
        json = JSON.parse(response.body)
        expect(json['is_login']).to eq(false)
        expect(json['message']).to eq("ユーザーが存在しません")
      end
    end
  end
end
