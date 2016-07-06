class DownloadPresenter
  def initialize(params)
    @year = params[:year]
    @territory_id = params[:territory_id]
    @territory_name = params[:territory_name]
  end

  def headers
    generate_headers
  end

  def value_rows
    generate_value_rows
  end

  def span
    classifications.count + 1
  end

  def filename
    "[#{@territory_name}] " +
    I18n.t('map.index.transitions.matrix.download_file',
      from_year: years.first,
      to_year: years.last
    ) + ".xlsx"
  end

  private

  def years
    @year.split(',')
  end

  def classifications
    @classifications ||= TerrasAPI.classifications
  end

  def transitions
    @transitions ||= TerrasAPI.transitions(
      @year, @territory_id
    )["transitions"]
  end

  def generate_headers
    [
      to_year_header,
      classifications_header
    ]
  end

  def to_year_header
    header = ['', '', years.last]
    header.fill('', header.size, classifications.count - 1)
  end

  def classifications_header
    header = classifications.map { |c| c["name"] }
    header.unshift('', '')
  end

  def generate_value_rows
    data = []

    classifications.each do |from|
      row = [years.first, from["name"]]

      classifications.each do |to|
        row << transition_area(from, to)
      end

      data << row
    end

    data
  end

  def transition_area(from, to)
     transition = transitions.find do |t|
        t["from"] == from["id"] && t["to"] == to["id"]
     end

     return transition["area"] if transition
     '-'
  end
end
