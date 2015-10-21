class TerrasAPI::TransitionsController < ApplicationController
  def index
    @transitions = TerrasAPI.transitions(transition_params[:year],
                                         transition_params[:territory_id])
  end

  private

  def transition_params
    params.permit(:year, :territory_id)
  end
end
