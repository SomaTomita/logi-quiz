class CreateExplanations < ActiveRecord::Migration[7.0]
  def change
    create_table :explanations do |t|
      t.integer :question_id
      t.text :explanation_text

      t.timestamps
    end
  end
end
