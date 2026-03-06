class Explanation < ApplicationRecord
  belongs_to :question

  # 解説テキストは必須
  validates :explanation_text, presence: true
end
