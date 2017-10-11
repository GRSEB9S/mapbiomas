class CreateMaps < ActiveRecord::Migration
  def change
    create_table :maps do |t|
      t.string :name, null: false
      t.json :options, null: false, default: {}
      t.references :user
    end
  end
end
