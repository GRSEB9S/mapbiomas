class API::StatisticsController < ApplicationController
  respond_to :json

  def index
    @statistics = TerrasAPI.statistics(transition_params[:territory_id],
                                       transition_params[:classification_id],
                                       transition_params[:grouped])
    respond_with(@statistics)
  end

  private

  def transition_params
    params.permit(:territory_id, :classification_id, :grouped)
  end
end
