class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  enum occupation_area: [:health, :environment, :farming, :economy, :geography,
                         :education, :others]

  has_many :maps

  validates :name, presence: true

  def self.biomes_and_transversal_themes
    {
      atlantic_forest: 0,
      amazon: 1,
      cerrado: 2,
      caatinga: 3,
      pampa: 4,
      coastal_zone: 5,
      pantanal: 6,
      agriculture: 7,
      livestock: 8,
      urban_areas: 9
    }
  end

  def self.biomes_and_transversal_themes_options
    biomes_and_transversal_themes.map do |key, value|
      [I18n.t("activerecord.attributes.enums.user.biomes_and_transversal_themes.#{key}"), value]
    end
  end

  def self.occupation_areas_options
    occupation_areas.map do |key, _value|
      [I18n.t("activerecord.attributes.enums.user.occupation_areas.#{key}"), key]
    end
  end
end
