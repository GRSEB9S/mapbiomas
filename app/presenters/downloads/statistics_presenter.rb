class Downloads::StatisticsPresenter
  def initialize(params)
    @territory_ids = params[:territory_ids]
    @territory_names = params[:territory_names]
    @classification_ids = params[:classification_ids]
  end

  def header
    generate_header
  end

  def value_rows
    generate_value_rows
  end

  def span
    return 0 if one_classification_and_one_territory?
    return territory_ids.size if many_territories?
    return classification_ids.size if many_classifications?
  end

  def worksheet_name
    I18n.t('stats.title')
  end

  def filename
    "[#{@territory_names}] " +
      I18n.t('stats.table.download_file') + '.xlsx'
  end

  private

  def one_classification_and_one_territory?
    territory_ids.size == 1 && classification_ids.size == 1
  end

  def many_territories?
    territory_ids.size > 1
  end

  def many_classifications?
    classification_ids.size > 1
  end

  def territory_ids
    @territory_ids.split(',').map(&:to_i)
  end

  def territory_names
    @territory_names.split(',')
  end

  def classification_ids
    @classification_ids.split(',').map(&:to_i)
  end

  def classifications
    classifications = TerrasAPI.classifications
    selected_classifications = classifications.select do |classification|
      classification_ids.include?(classification['id'])
    end

    selected_classifications.sort_by { |classification| classification['id'] }
  end

  def statistics
    @statistics ||= TerrasAPI
                    .statistics(@territory_ids, @classification_ids)
                    .sort_by { |statistic| statistic['year'] }
                    .group_by { |statistic| statistic['territory'] }
  end

  def statistics_by_territory_and_classification(territory, classification)
    statistics[territory]
      .select { |statistic| statistic['id'] == classification['id'] }
      .sort_by { |statistic| statistic['year'] }
  end

  def generate_header
    headers = [
      I18n.t('stats.territories.title'),
      I18n.t('stats.classifications.title')
    ]
    headers = headers.reverse if territory_ids.size > 1

    headers + Setting.available_years.unshift
  end

  def generate_value_rows
    data = []

    territory_ids.each_with_index do |territory, index|
      classifications.each do |classification|
        headers = [territory_names[index], classification['name']]
        headers = headers.reverse if many_territories?

        data << headers + statistics_by_territory_and_classification(
          territory, classification
        ).map { |statistic| statistic['area'] }
      end
    end

    data
  end
end
