class Section < ApplicationRecord
  # セクション削除時に関連する問題・ユーザー進捗も連動削除（孤立レコード防止）
  has_many :questions, dependent: :destroy
  has_many :user_sections, dependent: :destroy
  has_many :users, through: :user_sections

  # セクション名は必須かつ一意（重複セクション防止）
  validates :section_name, presence: true, uniqueness: true
end
