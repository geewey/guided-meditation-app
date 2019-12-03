class TracksController < ApplicationController

    def index
        track = Track.all
        render json: track, :include => {
            :favorites => {:except => [:created_at, :updated_at]}
        }, :except => [:created_at, :updated_at]
    end

end
