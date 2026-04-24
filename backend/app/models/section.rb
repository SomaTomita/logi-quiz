class Section < ApplicationRecord
  # セクション削除時に関連する問題・ユーザー進捗も連動削除（孤立レコード防止）
  has_many :questions, dependent: :destroy
  has_many :user_sections, dependent: :destroy
  has_many :users, through: :user_sections

  # セクション名は必須かつロケール内で一意
  validates :section_name, presence: true, uniqueness: { scope: :locale }
  validates :locale, presence: true, inclusion: { in: %w[ja en] }

  scope :by_locale, ->(locale) { where(locale: locale) }
end
