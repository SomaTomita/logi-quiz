class CreateQuestions < ActiveRecord::Migration[7.0]
  def change
    create_table :questions do |t|
      t.integer :section_id
      t.text :question_text

      t.timestamps
    end
  end
end
