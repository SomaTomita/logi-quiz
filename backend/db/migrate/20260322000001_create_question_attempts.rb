class CreateQuestionAttempts < ActiveRecord::Migration[7.0]
  def change
    create_table :question_attempts do |t|
      t.references :user,     null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.references :choice,   null: true,  foreign_key: true
      t.boolean    :correct,  null: false, default: false
      t.integer    :response_time_ms
      t.timestamps
    end

    add_index :question_attempts, [:user_id, :question_id, :created_at], name: 'idx_qa_user_question_created'
  end
end
