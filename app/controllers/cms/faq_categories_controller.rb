class Cms::FaqCategoriesController < ApplicationController
  before_action :set_faq_category, only: [:show, :update, :destroy]

  def index
    @faq_categories = FaqCategory.all
    render json: @faq_categories
  end

  def show
    render json: @faq_category
  end

  def create
    @faq_category = FaqCategory.new(faq_category_params)
    if @faq_category.save
      render json: @faq_category, status: :created
    else
      render json: @faq_category.errors, status: :unprocessable_entity
    end
  end

  def update
    if @faq_category.update(faq_category_params)
      render json: @faq_category, status: :ok
    else
      render json: @faq_category.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @faq_category.destroy
    render json: @faq_category, status: :ok
  end

  private

  def set_faq_category
    @faq_category = FaqCategory.find(params[:id])
  end

  def faq_category_params
    params.require(:faq_category).permit(:name)
  end
end
