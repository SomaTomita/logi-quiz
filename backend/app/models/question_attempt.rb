class QuestionAttempt < ApplicationRecord
  belongs_to :user
  belongs_to :question
  belongs_to :choice, optional: true

  validates :correct, inclusion: { in: [true, false] }
end
