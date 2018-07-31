class Cms::GlossaryCategoriesController < ApplicationController
  before_action :set_glossary_category, only: [:show, :update, :destroy]

  def index
    @glossary_categories = GlossaryCategory.all
    render json: @glossary_categories
  end

  def show
    render json: @glossary_category
  end

  def create
    @glossary_category = GlossaryCategory.new(glossary_category_params)

    @glossary_category.user = current_api_user

    if @glossary_category.save
      render json: @glossary_category, status: :created
    else
      render json: @glossary_category.errors, status: :unprocessable_entity
    end
  end

  def update
    if @glossary_category.update(glossary_category_params)
      render json: @glossary_category, status: :ok
    else
      render json: @glossary_category.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @glossary_category.destroy
    render json: @glossary_category, status: :ok
  end

  private

  def set_glossary_category
    @glossary_category = GlossaryCategory.find(params[:id] || params[:glossary_category_id])
  end

  def glossary_category_params
    params.require(:glossary_category).permit(:name)
  end
end
