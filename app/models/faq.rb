class Faq < ActiveRecord::Base
  belongs_to :faq_category

  validates :name, presence: true, uniqueness: true
end
