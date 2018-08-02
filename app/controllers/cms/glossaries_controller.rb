class Cms::GlossariesController < ApplicationController
  before_action :set_glossary, only: %i[update destroy]

  def new
    @glossary = Glossary.new
  end

  def create
    @glossary = Glossary.new(glossary_params)

    if @glossary.save
      render json: @glossary, status: :created
    else
      render json: @glossary.errors, status: :unprocessable_entity
    end
  end

  def update
    if @glossary.update(glossary_params)
      render json: @glossary, status: :ok
    else
      render json: @glossary.errors, status: :unprocessable_entity
    end
  end

  def destroy
    glossary = @glossary
    @glossary.destroy
    redirect_to new_cms_glossary_path, flash[:notice] = t(:glossary_destroy, word: glossary.word)
  end

  private

  def set_glossary
    @glossary = Glossary.find(params[:id])
  end

  def glossary_params
    params.require(:glossary).permit(:word, :definition, :glossary_category_id)
  end
end
