class UsersController < ApplicationController
    
    def index
        users = User.all
        render json: users, :include => {
            :favorites => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end
    
    def create
        user = User.find_or_create_by(username: params["username"])
        render json: user, :include => {
            :tracks => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

    def show
        user = User.find_by(id: params["id"])
        render json: user, :include => {
            :tracks => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

end
