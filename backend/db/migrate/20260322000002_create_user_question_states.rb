class CreateUserQuestionStates < ActiveRecord::Migration[7.0]
  def change
    create_table :user_question_states do |t|
      t.references :user,     null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.integer    :box_level,       null: false, default: 0
      t.datetime   :next_review_at,  null: false
      t.datetime   :last_reviewed_at, null: false
      t.integer    :attempt_count,   null: false, default: 0
      t.integer    :correct_count,   null: false, default: 0
      t.timestamps
    end

    add_index :user_question_states, [:user_id, :next_review_at]
    add_index :user_question_states, [:user_id, :question_id], unique: true
  end
end
