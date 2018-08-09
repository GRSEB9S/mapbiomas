class CreateFaqCategories < ActiveRecord::Migration
  def change
    create_table :faq_categories do |t|
      t.string :name, null: false

      t.timestamps null: false
    end
  end
end
