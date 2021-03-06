module AuthenticatedSystem
  class Unauthorized < StandardError; end

  def self.included(base)
    base.send(:include, AuthenticatedSystem::HelperMethods)
    base.send(:include, AuthenticatedSystem::ControllerMethods)
  end

  module HelperMethods

    def current_user
      @current_user ||= User.find(session[:current_user])
    rescue ActiveRecord::RecordNotFound
      nil
    end

    def authenticated?
      !current_user.blank?
    end

  end

  module ControllerMethods

    def require_authentication
      authenticate User.find_by_id(session[:current_user])
    rescue Unauthorized => e
      redirect_to new_session_path and return false
    end

    def authenticate(user)
      raise Unauthorized unless user
      session[:current_user] = user.id
    end

    def unauthenticate
      @current_user = session[:current_user] = nil
    end

  end
end