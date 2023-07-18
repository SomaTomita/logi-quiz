class CreateChoices < ActiveRecord::Migration[7.0]
  def change
    create_table :choices do |t|
      t.integer :question_id
      t.string :choice_text
      t.boolean :is_correct

      t.timestamps
    end
  end
end
