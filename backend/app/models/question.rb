class Question < ApplicationRecord
    has_many :choices
    belongs_to :section
    has_one :explanation
  
    validates :question_text, presence: true
  
    accepts_nested_attributes_for :choices
    accepts_nested_attributes_for :explanation
end
  