class User < ApplicationRecord
        devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable, :confirmable # ← confirmableを追加する
        include DeviseTokenAuth::Concerns::User


        has_many :user_sections
        has_many :cleared_sections, through: :user_sections, source: :section
end