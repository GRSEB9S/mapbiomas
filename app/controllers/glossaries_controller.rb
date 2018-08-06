class GlossariesController < ApplicationController
  def index
    @glossaries = Glossary.paginate(page: params[:page])
  end
end
