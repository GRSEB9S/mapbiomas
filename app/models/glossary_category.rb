class GlossaryCategory < ActiveRecord::Base
  has_many :glossaries

  validates :name, presence: true, uniqueness: true
end
