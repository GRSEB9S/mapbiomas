class CreateGlossaries < ActiveRecord::Migration
  def change
    create_table :glossaries do |t|
      t.string :word, null: false
      t.text :definition, null: false
      t.references :glossary_category, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
