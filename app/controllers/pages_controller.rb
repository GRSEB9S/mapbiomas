class PagesController < ApplicationController
  def methodology
  end

  def about
  end

  def download_notes
    send_file("#{Rails.root}/public/Metodologia_Mapbiomas_23Nov2015.pdf")
  end
end
