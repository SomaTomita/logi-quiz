class AddCorrectAnswersCountToUserSections < ActiveRecord::Migration[7.0]
  def change
    add_column :user_sections, :correct_answers_count, :integer, default: 0
  end
end
