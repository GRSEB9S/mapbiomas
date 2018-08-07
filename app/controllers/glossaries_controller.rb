class GlossariesController < ApplicationController
  def index
    @glossaries = Glossary.paginate(page: params[:page]).where(locale: cookies[:locale])
  end
end
