class AddDashboardIndexAndTightenConstraints < ActiveRecord::Migration[7.0]
  def change
    # ダッシュボードの「直近クリア10件」クエリ用
    add_index :user_sections, [:user_id, :cleared_at]

    # 孤児レコードをDBレベルで防止
    change_column_null :questions, :section_id, false
    change_column_null :choices, :question_id, false
    change_column_null :explanations, :question_id, false

    # is_correct は必ず true/false を持つ
    change_column_default :choices, :is_correct, from: nil, to: false
    change_column_null :choices, :is_correct, false
  end
end
