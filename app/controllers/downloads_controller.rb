class DownloadsController < ApplicationController
  respond_to :xlsx

  def download
    @download_presenter = DownloadPresenter.new(params)
    render xlsx: 'download/download',
      filename: @download_presenter.filename
  end
end

