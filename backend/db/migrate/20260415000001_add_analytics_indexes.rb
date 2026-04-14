class AddAnalyticsIndexes < ActiveRecord::Migration[7.0]
  def up
    # Covers correctness_vs_speed: equality on correct, range on response_time_ms
    add_index :question_attempts, [:correct, :response_time_ms],
              name: 'idx_qa_correct_response_time'

    # Covers topic accuracy trend: join on question_id + date range filter
    add_index :question_attempts, [:question_id, :created_at],
              name: 'idx_qa_question_created'

    # Covers active_user_count: range on created_at + distinct user_id
    add_index :question_attempts, [:created_at, :user_id],
              name: 'idx_qa_created_user'

    # Covers srs_impact_by_segment and retention_decay_curves
    add_index :user_question_states, [:user_id, :box_level],
              name: 'idx_uqs_user_box_level'
  end

  def down
    remove_index :question_attempts, name: 'idx_qa_correct_response_time'
    remove_index :question_attempts, name: 'idx_qa_question_created'
    remove_index :question_attempts, name: 'idx_qa_created_user'
    remove_index :user_question_states, name: 'idx_uqs_user_box_level'
  end
end
