class TerrasAPI
  include HTTParty

  base_uri ENV['TERRAS_API_URL']
  format :json

  def self.territories
    get("/territories")
  end

  def self.classifications
    get("/classifications")
  end

  def self.coverage(year, territory_id, classification_ids)
    get("/coverage", query: {
      year: year,
      territory_id: territory_id,
      classification_ids: classification_ids
    })
  end

  def self.transitions(year, territory_id)
    get("/transitions", query: {
      year: year,
      territory_id: territory_id
    })
  end
end
