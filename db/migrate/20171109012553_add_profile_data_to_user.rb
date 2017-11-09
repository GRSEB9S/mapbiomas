class AddProfileDataToUser < ActiveRecord::Migration
  def change
    add_column :users, :institution, :string
    add_column :users, :occupation, :string
    add_column :users, :occupation_area, :integer
    add_column :users, :project_description, :text
    add_column :users, :biomes_and_transversal_themes, :integer, array: true, default: []
    add_column :users, :linkedin_url, :string
    add_column :users, :facebook_url, :string
    add_column :users, :lattes_url, :string
    add_column :users, :phone, :string
    add_column :users, :city, :string
    add_column :users, :state, :string
    add_column :users, :receive_newsletter, :boolean
    add_column :users, :participate_in_groups, :boolean
  end
end
