class AddLocaleToFaqs < ActiveRecord::Migration
  def change
    add_column :faqs, :locale, :string, null: false, default: 'pt-br'
  end
end
