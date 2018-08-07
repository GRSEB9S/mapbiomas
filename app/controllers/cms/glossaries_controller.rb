class Cms::GlossariesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_glossary, only: %i[edit update destroy]

  def new
    @glossary = Glossary.new
    authorize @glossary
  end

  def create
    @glossary = Glossary.new(glossary_params)
    authorize @glossary
    if @glossary.save
      redirect_to glossaries_path
    else
      flash.now[:error] = I18n.t('glossaries.create_error')
      render :new
    end
  end

  def edit; end

  def update
    authorize @glossary
    if @glossary.update(glossary_params)
      redirect_to glossaries_path
    else
      flash.now[:error] = I18n.t('glossaries.update_error')
      render :edit
    end
  end

  def destroy
    authorize @glossary
    @glossary.destroy
    redirect_to glossaries_path
  end

  private

  def set_glossary
    @glossary = Glossary.find(params[:id])
  end

  def glossary_params
    params.require(:glossary).permit(:word, :definition, :locale)
  end
end
