class User < ApplicationRecord
        devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable, :confirmable # ← confirmableを追加する
        include DeviseTokenAuth::Concerns::User


        has_many :user_sections, dependent: :destroy #ユーザー削除時に、idに紐づいた学習積み上げ機能、履歴残す機能を全て削除
        has_many :cleared_sections, through: :user_sections, source: :section, dependent: :destroy
end