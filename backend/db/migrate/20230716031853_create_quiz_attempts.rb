class CreateQuizAttempts < ActiveRecord::Migration[7.0]
  def change
    create_table :quiz_attempts do |t|
      t.integer :section_id
      t.integer :user_id
      t.integer :score
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end
end
