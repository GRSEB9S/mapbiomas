class FaqCategory < ActiveRecord::Base
  has_many :faqs

  validates :question, presence: true, uniqueness: true
  validates :answer, presence: true
end
