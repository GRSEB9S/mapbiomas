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
    query_params = { classification_ids: classification_ids }
    territory_ids = territory_id.split(',')

    query_params = query_params.merge(year: year) if year.present?

    coverage_data = territory_ids.map do |id|
      get("/dashboard/services/statistics/coverage", query:
          query_params.merge(territory_id: id)).as_json
    end

    sum_areas(coverage_data, coverage_keys)
  end

  def self.transitions(year, territory_id)
    query_params = { year: year }
    territory_ids = territory_id.split(',')

    data = territory_ids.map do |id|
      get("/dashboard/services/statistics/transitions", query:
        query_params.merge(territory_id: id)).as_json
    end

    transitions_data = data.map { |d| d['transitions'] }

    sum_areas(transitions_data, transitions_keys)
  end

  def self.qualities(year)
    get("/dashboard/services/qualities", query: {
      year: year
    })
  end

  def self.statistics(territory_id, classification_ids, grouped = false)
    if grouped
      query_params = { classification_id: classification_ids }
      territory_ids = territory_id.split(',')

      grouped_coverage_data = territory_ids.map do |id|
        # get("/dashboard/services/statistics/groupedcover", query: {
        get("http://dev.seeg-mapbiomas.terras.agr.br/colecao2/dashboard/services/statistics/groupedcover", query:
          query_params.merge(territory_id: id))
      end

      sum_areas(grouped_coverage_data, grouped_coverage_keys)
    else
      # get("/dashboard/services/statistics/groupedcover", query: {
      get("http://dev.seeg-mapbiomas.terras.agr.br/colecao2/dashboard/services/statistics/groupedcover", query: {
        territory_id: territory_id,
        classification_id: classification_ids
      })
    end
  end

  def self.transitions_keys
    %w(from from_l1 from_l2 from_l3 to to_l1 to_l2 to_l3)
  end

  def self.coverage_keys
    %w(id l1 l2 l3 year)
  end

  def self.grouped_coverage_keys
    %w(id l1 l2 l3 year)
  end

  def self.sum_areas(collection, keys)
    collection
      .flatten
      .group_by { |t| keys.map { |k| t[k] } }
      .transform_values { |value| value.map { |v| v['area'] }.reduce(&:+) }
      .to_a
      .map do |(grouped_values, area)|
        Hash[keys.zip(grouped_values)].merge(area: area)
      end
  end
end
