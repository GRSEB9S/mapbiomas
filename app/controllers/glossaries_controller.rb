class GlossariesController < ApplicationController
  def index
    @glossaries = Glossary.paginate(page: params[:page]).where(locale: cookies[:locale].downcase).order(word: :asc)
  end
end
