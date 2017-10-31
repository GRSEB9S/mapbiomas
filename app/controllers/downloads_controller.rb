class DownloadsController < ApplicationController
  respond_to :xlsx

  def transitions
    @download_presenter = Downloads::TransitionsPresenter.new(params)

    render xlsx: 'downloads/transitions',
           filename: @download_presenter.filename
  end

  def statistics
    @download_presenter = Downloads::StatisticsPresenter.new(params)

    render xlsx: 'downloads/statistics',
           filename: @download_presenter.filename
  end
end
