class CreateAttemptAnswers < ActiveRecord::Migration[7.0]
  def change
    create_table :attempt_answers do |t|
      t.integer :attempt_id
      t.integer :question_id
      t.integer :selected_choice_id

      t.timestamps
    end
  end
end
