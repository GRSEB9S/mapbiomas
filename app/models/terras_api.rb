class TerrasAPI
  include HTTParty

  base_uri ENV['TERRAS_API_URL']
  format :json
  caches_api_responses key_name: "terras", expire_in: 1.month

  def self.territories(name = nil, category = nil)
    get("/dashboard/services/territories", query: {
      language: I18n.locale.to_s,
      category: category,
      name: name
    }.compact)
  end

  def self.classifications
    get("/dashboard/services/classifications", query: {
      language: I18n.locale.to_s
    })
  end

  def self.coverage(year, territory_id, classification_ids)
    if year.present?
      get("/dashboard/services/statistics/coverage", query: {
        year: year,
        territory_id: territory_id,
        classification_ids: classification_ids
      })
    else
      get("/dashboard/services/statistics/coverage", query: {
        territory_id: territory_id,
        classification_ids: classification_ids
      })
    end
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

  def self.statistics(territory_id, classification_ids)
    # Statistics API isn't in TERRAS_API_URL yet, so we use this URL
    HTTParty.get("http://dev.seeg-mapbiomas.terras.agr.br/colecao2/dashboard/services/statistics/groupedcover", query: {
      territory_id: territory_id,
      classification_id: classification_ids
    })
  end
end
