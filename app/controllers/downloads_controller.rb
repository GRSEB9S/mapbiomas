class DownloadsController < ApplicationController
  before_action :set_statistics_download_presenter, only: :statistics

  respond_to :xlsx

  def transitions
    @download_presenter = Downloads::TransitionsPresenter.new(params)

    render xlsx: 'downloads/transitions',
           filename: @download_presenter.filename
  end

  def statistics
    render xlsx: 'downloads/statistics',
           filename: @download_presenter.filename
  end

  def set_statistics_download_presenter
    if params[:grouped]
      @download_presenter = Downloads::GroupedStatisticsPresenter.new(params)
    else
      @download_presenter = Downloads::StatisticsPresenter.new(params)
    end
  end
end
