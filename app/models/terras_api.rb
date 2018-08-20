class TerrasAPI
  include HTTParty

  COLLECTION_2_STATISTICS_URL = 'http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/groupedcover'
  GROUPED_COVER_FILE_PATH = '/dashboard/services/statistics/groupedcover'

  base_uri ENV['TERRAS_API_URL']
  format :json

  def self.territories(name = nil, category = nil)
    cache("#{__method__.to_s}-#{name}-#{category}-#{locale}") do
      get("/dashboard/services/territories", query: {
        language: locale,
        category: category,
        name: name
      }.compact).parsed_response
    end
  end

  def self.infra_levels
    cache("#{__method__.to_s}-#{locale}") do
      get("/dashboard/services/statistics/infra_levels", query: {
        language: locale
      }).parsed_response
    end
  end

  def self.car(year, territory_id)
    query_params = { territory_id: "100000#{territory_id}" }

    query_params = query_params.merge(year: year) if year.present?

    cache("#{__method__.to_s}-#{year}-#{territory_id}-#{locale}") do
      get("/dashboard/services/statistics/coverage", query:
          query_params).parsed_response
    end
  end

  def self.infra_buffer(params)
    cache([
     __method__.to_s,
     params[:territory_id],
     params[:category_id],
     params[:category_name],
     params[:buffer],
     locale
    ].join('-')) do
      get("/dashboard/services/statistics/infra_buffer", query: {
        territorio_id: params[:territory_id],
        categoria_id: params[:category_id],
        categoria_name: params[:category_name],
        buffer: params[:buffer],
        language: locale
      }).parsed_response
    end
  end

  def self.classifications
    cache("#{__method__.to_s}-#{locale}") do
      get("/dashboard/services/classifications", query: {
        language: locale
      }).parsed_response
    end
  end

  def self.coverage(year, territory_id, classification_ids)
    query_params = { classification_ids: classification_ids }
    territory_ids = territory_id.split(',')

    query_params = query_params.merge(year: year) if year.present?

    coverage_data = territory_ids.map do |id|
      cache("#{__method__.to_s}-#{year}-#{territory_id}-#{classification_ids}-#{locale}") do
        get("/dashboard/services/statistics/coverage", query:
            query_params.merge(territory_id: id)).parsed_response
      end
    end

    sum_areas(coverage_data, coverage_keys)
  end

  def self.transitions(year, territory_id)
    query_params = { year: year }
    territory_ids = territory_id.split(',')

    data = territory_ids.map do |id|
      cache("#{__method__.to_s}-#{year}-#{territory_id}-#{locale}") do
        get("/dashboard/services/statistics/transitions", query:
          query_params.merge(territory_id: id)).parsed_response
      end
    end

    transitions_data = data.map { |d| d['transitions'] }

    sum_areas(transitions_data, transitions_keys)
  end

  def self.qualities(year)
    cache("#{__method__.to_s}-#{year}-#{locale}") do
      get("/dashboard/services/qualities", query: {
        year: year
      }).parsed_response
    end
  end

  def self.statistics(territory_id, classification_ids, grouped = false, file_path = GROUPED_COVER_FILE_PATH)
    if grouped
      query_params = { classification_id: classification_ids }
      territory_ids = territory_id.split(',')

      grouped_coverage_data = territory_ids.map do |id|
        get(file_path, query:
          query_params.merge(territory_id: id))
      end

      sum_areas(grouped_coverage_data, grouped_coverage_keys)
    else
      cache("#{__method__.to_s}-#{territory_id}-#{classification_ids}-#{grouped}-#{file_path}-#{locale}") do
        get(file_path, query: {
          territory_id: territory_id,
          classification_id: classification_ids
        }).parsed_response
      end
    end
  end

  def self.collection_2_statistics(territory_id, classification_ids, grouped = false)
    statistics(territory_id, classification_ids, grouped, COLLECTION_2_STATISTICS_URL)
  end

  def self.inspector(year, latitude, longitude)
    cache("#{__method__.to_s}-#{year}-#{latitude}-#{longitude}-#{locale}") do
      get("/dashboard/services/statistics/inspector", query: {
        year: year,
        lat: latitude,
        lng: longitude
      }).parsed_response
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

  private

  def self.cache(name)
    Rails.cache.fetch(name, expires_in: 1.month) do
      yield
    end
  end

  def self.locale
    I18n.locale.to_s
  end
end
