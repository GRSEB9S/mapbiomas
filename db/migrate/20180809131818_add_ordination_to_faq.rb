class AddOrdinationToFaq < ActiveRecord::Migration
  def change
    add_column :faqs, :ordination, :integer
    Faq.all.each_with_index { |item, index| item.update(ordination: index + 1) }
    change_column_null :faqs, :ordination, false
  end
end
