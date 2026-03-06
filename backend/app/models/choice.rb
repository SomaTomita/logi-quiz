class Choice < ApplicationRecord
  belongs_to :question

  # 選択肢テキストは必須、正誤フラグはtrue/falseのいずれかであること
  validates :choice_text, presence: true
  validates :is_correct, inclusion: { in: [true, false] }
end
