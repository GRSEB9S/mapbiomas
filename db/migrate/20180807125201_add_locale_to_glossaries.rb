class AddLocaleToGlossaries < ActiveRecord::Migration
  def change
    add_column :glossaries, :locale, :string, null: false, default: 'pt-BR'
  end
end
