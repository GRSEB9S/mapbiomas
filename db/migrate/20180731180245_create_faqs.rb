class CreateFaqs < ActiveRecord::Migration
  def change
    create_table :faqs do |t|
      t.string :question, null: false
      t.text :answer, null: false
      t.references :faq_category, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
