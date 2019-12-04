class TracksController < ApplicationController

    def index
        tracks = Track.all
        render json: tracks, :except => [:created_at, :updated_at]
    end

end
