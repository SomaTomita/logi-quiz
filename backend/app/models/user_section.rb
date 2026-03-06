class UserSection < ApplicationRecord
  belongs_to :user
  belongs_to :section

  # クリア日時は必須、正解数は0以上の整数
  validates :cleared_at, presence: true
  validates :correct_answers_count, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  # ダッシュボード表示用スコープ: 新しい順に10件、セクション情報をeager load（N+1防止）
  scope :recent, -> { order(cleared_at: :desc) }
  scope :for_dashboard, -> { recent.limit(10).includes(:section) }
end
