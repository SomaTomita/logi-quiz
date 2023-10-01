class Question < ApplicationRecord
    belongs_to :section
    has_many :choices, dependent: :destroy
    has_one :explanation, dependent: :destroy
    validates :question_text, presence: true
  
    # Questionモデルから関連するChoiceモデルの属性も同時に保存・更新・削除することを許可
    accepts_nested_attributes_for :choices, allow_destroy: true
    accepts_nested_attributes_for :explanation, allow_destroy: true
end
