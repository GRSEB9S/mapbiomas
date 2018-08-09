# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'

puts 'Cleaning DB'
Faq.destroy_all
Glossary.destroy_all
puts 'Done'

puts 'Seeding DB'
CSV.foreach("#{ Rails.root }/db/data/glossary_seed.csv", headers: true) do |row|
  locale = row['Lingua'] || 'pt-BR'
  Glossary.create(word: row['Words'], definition: row['Definition'], locale: locale.downcase.chomp)
end

CSV.foreach("#{ Rails.root }/db/data/faq_seed.csv", headers: true) do |row|
  locale = row['Língua'] || 'pt-BR'
  Faq.create(ordination: row['ID'], question: row['Pergunta'], answer: row['Resposta'], locale: locale.downcase.chomp)
end
puts "Done - #{Glossary.count} words created"
puts "Done - #{Faq.count} questions created"
