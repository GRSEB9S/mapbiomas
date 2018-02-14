class UserPolicy < ApplicationPolicy
  def access_registered?
    user.admin?
  end
end
