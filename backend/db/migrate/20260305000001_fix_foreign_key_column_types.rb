# 外部キー制約を追加するために、integer型のFKカラムをbigint型に統一する
# （主キーがbigintのため、FK側もbigintでないと制約が貼れない）
class FixForeignKeyColumnTypes < ActiveRecord::Migration[7.0]
  def change
    change_column :choices, :question_id, :bigint
    change_column :explanations, :question_id, :bigint
    change_column :questions, :section_id, :bigint
    change_column :user_sections, :section_id, :bigint
  end
end
