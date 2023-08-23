class CreateStudyLogs < ActiveRecord::Migration[7.0]
  def change
    create_table :study_logs do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.integer :study_time

      t.timestamps
    end
  end
end
