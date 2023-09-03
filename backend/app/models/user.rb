class User < ApplicationRecord
        # パスワードのリセットや変更、クッキーを使用してユーザーのセッションを覚える、メールアドレスの正当性を確認等
        devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable, :confirmable
        include DeviseTokenAuth::Concerns::User  # トークンベースの認証をサポートするためのメソッドやヘルパーをUserモデルに追加


        #ユーザー削除時に、idに紐づいた学習積み上げ機能、履歴残す機能を全て削除
        has_many :user_sections, dependent: :destroy 
        has_many :cleared_sections, through: :user_sections, source: :section
        has_many :study_logs, dependent: :destroy
end