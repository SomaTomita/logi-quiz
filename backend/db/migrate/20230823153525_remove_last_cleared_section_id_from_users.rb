class RemoveLastClearedSectionIdFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :last_cleared_section_id, :integer
  end
end
