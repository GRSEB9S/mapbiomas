class Glossary < ActiveRecord::Base
  validates :word, presence: true, uniqueness: { scope: :locale }
  validates :definition, presence: true

  self.per_page = 50
end
