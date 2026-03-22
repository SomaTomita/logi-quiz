class UserQuestionState < ApplicationRecord
  belongs_to :user
  belongs_to :question

  validates :question_id, uniqueness: { scope: :user_id }
  validates :box_level, inclusion: { in: 0..4 }
  validates :attempt_count, :correct_count, numericality: { greater_than_or_equal_to: 0 }
end
