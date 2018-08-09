class AddLocaleToGlossaries < ActiveRecord::Migration
  def change
    add_column :glossaries, :locale, :string, null: false, default: 'pt-br'
  end
end
