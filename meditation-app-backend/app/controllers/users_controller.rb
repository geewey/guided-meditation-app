class UsersController < ApplicationController

    def index
        users = User.all
        render json: users, :include => {
            :favorites => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end
    
    def create
        byebug
        user = User.new
        user.username = "HI MOM!"
        render json: user, except: [:created_at, :updated_at]
    end

end
