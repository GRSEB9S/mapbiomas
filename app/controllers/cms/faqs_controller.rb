class Cms::FaqsController < ApplicationController
  before_action :set_faq, only: [:show, :update, :destroy]

  def index
    @faqs = Faq.all
    render json: @faqs
  end

  def show
    render json: @faq
  end

  def create
    @faq = Faq.new(faq_params)
    if @faq.save
      render json: @faq, status: :created
    else
      render json: @faq.errors, status: :unprocessable_entity
    end
  end

  def update
    if @faq.update(faq_params)
      render json: @faq, status: :ok
    else
      render json: @faq.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @faq.destroy
    render json: @faq, status: :ok
  end

  private

  def set_faq
    @faq = Faq.find(params[:id])
  end

  def faq_params
    params.require(:faq).permit(:name)
  end
end
