class FaqsController < ApplicationController
  def index
    @faqs = Faq.paginate(page: params[:page])
               .where(locale: cookies[:locale].downcase)
               .order(ordination: :asc, updated_at: :desc)
  end
end
