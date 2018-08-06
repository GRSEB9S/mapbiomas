class DropGlossaryCategoriesTable < ActiveRecord::Migration
  def up
    remove_reference :glossaries, :glossary_category, index: true, foreign_key: true
    drop_table :glossary_categories
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
