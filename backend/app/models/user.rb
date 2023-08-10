class User < ApplicationRecord
        devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable, :confirmable # ← confirmableを追加する
        include DeviseTokenAuth::Concerns::User
end