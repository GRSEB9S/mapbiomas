class Glossary < ActiveRecord::Base
  belongs_to :glossary_category

  validates :word, presence: true, uniqueness: true
  validates :definition, presence: true
end
