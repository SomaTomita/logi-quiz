require 'rails_helper'

RSpec.describe "Auth::Sessions", type: :request do
  describe "GET /index" do

    context "ユーザーがログインしている場合" do
      let(:user) { create(:user) } # FactoryBotを使用して、テスト前にユーザーを作成

      before do
        # Deviseのconfirmableモジュールを使って、ユーザーのメールアドレスの確認をシミュレート (puts response.bodyにより判明)
        user.confirm
        # DeviseTokenAuthのログインエンドポイントを使用してテスト用ユーザーをログイン
        post "/auth/sign_in", params: { email: user.email, password: 'password' } # パスワードはFactoryで定義したものを使用
        # レスポンスヘッダから認証情報を取得してインスタンス変数に保存
        # sliceで指定したキーを持つ要素だけを新しいハッシュとして
        @auth_headers = response.headers.slice('access-token', 'client', 'uid')
      end

      it "returns the user's data" do
         # 認証ヘッダを使用してログイン状態で/auth/sessionsエンドポイントにGETリクエスト
        get "/auth/sessions", headers: @auth_headers

        # HTTPレスポンスのボディをJSON形式からRubyのハッシュに変換 → 下記の検証をキーや値にアクセスしたテストが可能に
        json = JSON.parse(response.body)
        # テストの期待値と実際の値が == メソッドによって等しいかどうかをチェック
        expect(json['is_login']).to eq(true)
        expect(json['data']['email']).to eq(user.email)
      end
    end


    context "ユーザーがログインしていない場合" do
      it "returns not logged in message" do
        # コンテキスト内でログインせずに/auth/sessionsエンドポイントにGETリクエスト
        get "/auth/sessions"
        json = JSON.parse(response.body)
        expect(json['is_login']).to eq(false)
        expect(json['message']).to eq("ユーザーが存在しません")
      end
    end
  end
end
