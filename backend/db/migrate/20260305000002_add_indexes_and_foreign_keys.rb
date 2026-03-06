# FKカラムにインデックスと外部キー制約を追加し、データ整合性とクエリ性能を向上させる
# study_logsには1ユーザー1日1レコードの一意制約も追加
class AddIndexesAndForeignKeys < ActiveRecord::Migration[7.0]
  def change
    # 検索パフォーマンス向上のためのインデックス追加
    add_index :choices, :question_id
    add_index :explanations, :question_id
    add_index :questions, :section_id

    # 参照整合性を保証する外部キー制約
    add_foreign_key :choices, :questions
    add_foreign_key :explanations, :questions
    add_foreign_key :questions, :sections
    add_foreign_key :user_sections, :sections
    add_foreign_key :user_sections, :users

    # 1ユーザー1日1レコードの一意制約（find_or_initialize_byの前提条件）
    add_index :study_logs, [:user_id, :date], unique: true, name: "index_study_logs_on_user_id_and_date"
  end
end
