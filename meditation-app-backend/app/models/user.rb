class User < ApplicationRecord
    has_many :favorites
    has_many :tracks, through: :favorites
end
