class AddLocaleToSections < ActiveRecord::Migration[7.0]
  def change
    add_column :sections, :locale, :string, null: false, default: "ja" unless column_exists?(:sections, :locale)
    remove_index :sections, :section_name, if_exists: true
    add_index :sections, [:section_name, :locale], unique: true
  end
end
