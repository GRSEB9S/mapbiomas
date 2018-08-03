class Glossary < ActiveRecord::Base
  validates :word, presence: true, uniqueness: true
  validates :definition, presence: true
end
