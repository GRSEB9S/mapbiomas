class Cms::FaqsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_faq, only: %i[edit update destroy]

  def new
    @faq = Faq.new
    authorize @faq
  end

  def create
    @faq = Faq.new(faq_params)
    @faq.ordination = Faq.count + 1 unless @faq.ordination
    authorize @faq
    if @faq.save
      redirect_to faqs_path
    else
      flash.now[:error] = I18n.t('faqs.create_error')
      render :new
    end
  end

  def edit; end

  def update
    authorize @faq
    if @faq.update(faq_params)
      redirect_to faqs_path
    else
      flash.now[:error] = I18n.t('faqs.update_error')
      render :edit
    end
  end

  def destroy
    authorize @faq
    @faq.destroy
    redirect_to faqs_path
  end

  private

  def set_faq
    @faq = Faq.find(params[:id])
  end

  def faq_params
    params.require(:faq).permit(:question, :answer, :locale, :ordination)
  end
end
