class StudyLog < ApplicationRecord
  belongs_to :user

  # 日付は必須かつユーザーごとに一意（1日1レコード）
  validates :date, presence: true, uniqueness: { scope: :user_id }
  # 学習時間は0以上の整数
  validates :study_time, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
end
