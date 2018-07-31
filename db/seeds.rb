# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'

puts 'Cleaning Glossary DB'

Glossary.destroy_all
GlossaryCategory.destroy_all
puts 'Done'

puts 'Seeding DB'
CSV.foreach("#{Rails.root}/db/data/glossary_seed.csv", {headers: true}) do |row|
  # TODO - waiting glossary final version with category field
  category = GlossaryCategory.find_by(name: 'teste') || GlossaryCategory.create(name: 'teste')
  Glossary.create(word: row['Palavras'], definition: row['Definição'], glossary_category: category)
end
puts "Done - #{Glossary.count} words created"
