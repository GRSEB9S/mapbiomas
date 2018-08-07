class DropFaqCategories < ActiveRecord::Migration
  def up
    remove_reference :faqs, :faq_category, index: true, foreign_key: true
    drop_table :faq_categories
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
