class CreateFaqs < ActiveRecord::Migration
  def change
    create_table :faqs do |t|
      t.string :question
      t.text :answer
      t.references :faq_category, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
