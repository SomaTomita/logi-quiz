class AddDashboardDataToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :total_play_time, :integer
    add_column :users, :total_questions_cleared, :integer
    add_column :users, :last_cleared_section_id, :integer
  end
end
