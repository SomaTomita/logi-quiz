class Question < ApplicationRecord
    has_many :choices, dependent: :destroy #クイズ削除時に、idに紐づいた選択肢、及び解説を全て削除
    belongs_to :section
    has_one :explanation, dependent: :destroy
    # Questionモデルのquestion_text属性が存在して、空ではないことの確認 (空の文字列（""）のような状態で保存されることを防ぐため)
    validates :question_text, presence: true
  
    # Questionモデルから関連するChoiceモデルの属性も同時に保存・更新することを許可
    accepts_nested_attributes_for :choices
end
