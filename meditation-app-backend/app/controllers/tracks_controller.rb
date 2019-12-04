class TracksController < ApplicationController

    def index
        tracks = Track.all
        render json: tracks, :include => {
            :favorites => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

end
