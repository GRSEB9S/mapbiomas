class Cms::GlossariesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_glossary, only: %i[update destroy]

  def new
    @glossary = Glossary.new
    authorize @glossary
  end

  def create
    @glossary = Glossary.new(glossary_params)
    authorize @glossary
    if @glossary.save
      redirect_to cms_glossaries_path, flash[:success] = I18n.t('glossaries.create_success')
    else
      render :new, flash[:error] = I18n.t('glossaries.create_error')
    end
  end

  def update
    authorize @glossary
    if @glossary.update(glossary_params)
      redirect_to cms_glossaries_path, flash[:success] = I18n.t('glossaries.update_success')
    else
      render :edit, flash[:error] = I18n.t('glossaries.update_failed')
    end
  end

  def destroy
    authorize @glossary
    @glossary.destroy
    redirect_to cms_glossaries_path, flash[:success] = I18n.t('glossaries.destroy_success')
  end

  private

  def set_glossary
    @glossary = Glossary.find(params[:id])
  end

  def glossary_params
    params.require(:glossary).permit(:word, :definition)
  end
end
