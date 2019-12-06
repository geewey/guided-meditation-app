class FavoritesController < ApplicationController
    
    def index
        favorites = Favorite.all
        render json: favorites, :include => {
            :user => {:except => [:created_at, :updated_at]},
            :track => {:except => [:created_at, :updated_at]}
            }, :except => [:created_at, :updated_at]
    end

    def create
        favorite = Favorite.create(user_id: params["user_id"], track_id: params["track_id"])
        render json: favorite, :include => {
            :user => {:except => [:created_at, :updated_at]},
            :track => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

    def show
        favorite = Favorite.find_by(id: params["id"])
        render json: favorite, :include => {
            :user => {:except => [:created_at, :updated_at]},
            :track => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

    def destroy
        favorite = Favorite.find_by(id: params["id"])
        favorite.delete
        render json: favorite, :include => {
            :user => {:except => [:created_at, :updated_at]},
            :track => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

end
