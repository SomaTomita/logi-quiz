class ChangeUserSections < ActiveRecord::Migration[7.0]
  def change
    create_table :user_sections do |t|
      t.bigint :user_id, null: false
      t.integer :section_id, null: false
      t.datetime :cleared_at, null: false
      t.integer :correct_answers_count, default: 0

      t.timestamps
    end

    add_index :user_sections, :user_id
    add_index :user_sections, :section_id
  end
end
