class Downloads::GroupedStatisticsPresenter < Downloads::StatisticsPresenter
  def initialize(params)
    @map_name = params[:map_name]
    super
  end

  def span
    classification_ids.size
  end

  def filename
    "[#{@map_name}] " + I18n.t('stats.table.download_file') + '.xlsx'
  end

  private

  def statistics
    @statistics ||= TerrasAPI
                    .statistics(@territory_ids, @classification_ids, true)
                    .sort_by { |statistic| statistic['year'] }
                    .group_by { |statistic| statistic['id'] }
  end

  def statistics_by_classification(classification)
    statistics[classification].sort_by { |statistic| statistic['year'] }
  end

  def generate_header
    headers = [
      I18n.t('stats.territories.title'),
      I18n.t('stats.classifications.title')
    ]

    headers + Setting.available_years.unshift
  end

  def generate_value_rows
    data = []

    classifications.each do |classification|
      headers = [@territory_names, classification['name']]

      data << headers + statistics_by_classification(classification['id'])
        .map { |statistic| statistic[:area] }
    end

    data
  end
end
