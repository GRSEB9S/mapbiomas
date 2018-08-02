class GlossariesController < ApplicationController
  def index
    @glossaries = Glossary.all
  end
end
