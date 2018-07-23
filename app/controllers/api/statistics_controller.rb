class API::StatisticsController < ApplicationController
  respond_to :json

  def index
    @statistics = TerrasAPI.statistics(*statistics_params)

    respond_with(@statistics)
  end

  def filtered
    @statistics = TerrasAPI.filtered_statistics(*statistics_params)

    respond_with(@statistics)
  end

  def unfiltered
    @statistics = TerrasAPI.unfiltered_statistics(*statistics_params)

    respond_with(@statistics)
  end

  def collection_2
    @statistics = TerrasAPI.collection_2_statistics(*statistics_params)

    respond_with(@statistics)
  end

  private

  def transition_params
    params.permit(:territory_id, :classification_id, :grouped)
  end

  def statistics_params
    [
      transition_params[:territory_id],
      transition_params[:classification_id],
      transition_params[:grouped]
    ]
  end
end
