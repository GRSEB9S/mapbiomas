class Faq < ActiveRecord::Base
  validates :question, presence: true, uniqueness: { scope: :locale }
  validates :answer, presence: true
  validates :ordination, presence: true

  before_validation :set_ordination

  private

  def set_ordination
    self.ordination = Faq.count + 1 unless persisted?
  end
end
