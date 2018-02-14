class UsersController < ApplicationController
  before_action :set_user

  def profile
  end

  def update
    new_params = user_params

    if new_params['biomes_and_transversal_themes'].nil?
      new_params['biomes_and_transversal_themes'] = []
    end

    if @user.update(new_params)
      flash[:success] = I18n.t('users.profile.flashes.success')
      redirect_to user_profile_path
    else
      flash[:error] = I18n.t('users.profile.flashes.error')
      redirect_to user_profile_path
    end
  end

  def registered
    authorize current_user, :access_registered?

    @users = User.all
  end

  private

  def set_user
    @user = current_user
  end

  def user_params
    params.require(:user).permit(
      :name, :email, :institution, :occupation, :occupation_area,
      :project_description, :linkedin_url, :facebook_url, :lattes_url,
      :phone, :city, :state, :receive_newsletter, :participate_in_groups,
      biomes_and_transversal_themes: []
    )
  end
end
