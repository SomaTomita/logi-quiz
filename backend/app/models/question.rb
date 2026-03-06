class Question < ApplicationRecord
  belongs_to :section
  # 問題削除時に選択肢・解説も連動削除
  has_many :choices, dependent: :destroy
  has_one :explanation, dependent: :destroy

  validates :question_text, presence: true

  # ネスト属性: 問題の作成・更新時に選択肢と解説を同時に保存・更新・削除可能にする
  # Admin::QuizzesControllerのquestion_paramsから利用
  accepts_nested_attributes_for :choices, allow_destroy: true
  accepts_nested_attributes_for :explanation, allow_destroy: true
end
