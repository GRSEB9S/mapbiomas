class TerrasAPI
  include HTTParty

  base_uri ENV['TERRAS_API_URL']
  format :json
  caches_api_responses key_name: "terras", expire_in: 1.month

  def self.territories(name = nil)
    get("/dashboard/services/territories", query: {
      name: name
    })
  end

  def self.classifications
    get("/dashboard/services/classifications")
  end

  def self.coverage(year, territory_id, classification_ids)
    get("/dashboard/services/statistics/coverage", query: {
      year: year,
      territory_id: territory_id,
      classification_ids: classification_ids
    })
  end

  def self.transitions(year, territory_id)
    get("/dashboard/services/statistics/transitions", query: {
      year: year,
      territory_id: territory_id
    })
  end

  def self.qualities(year)
    get("/dashboard/services/qualities", query: {
      year: year
    })
  end
end
