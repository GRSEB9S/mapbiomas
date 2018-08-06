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
puts 'Done'

puts 'Seeding DB'
CSV.foreach("#{ Rails.root }/db/data/glossary_seed.csv", headers: true) do |row|
  # TODO WAITING GLOSSARY FINAL VERSION WITH CATEGORY FIELD
  Glossary.create(word: row['Palavras'], definition: row['Definição'])
end
puts "Done - #{Glossary.count} words created"
