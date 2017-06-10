class DownloadsController < ApplicationController
  respond_to :xlsx

  def transitions
    @download_presenter = Downloads::TransitionsPresenter.new(params)

    render xlsx: 'downloads/transitions',
           filename: @download_presenter.filename
  end
end
