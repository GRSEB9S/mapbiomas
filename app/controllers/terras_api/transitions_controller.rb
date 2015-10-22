class TerrasAPI::TransitionsController < ApplicationController
  respond_to :json

  def index
    @transitions = TerrasAPI.transitions(transition_params[:year],
                                         transition_params[:territory_id])
    respond_with(@transitions)
  end

  private

  def transition_params
    params.permit(:year, :territory_id)
  end
end
