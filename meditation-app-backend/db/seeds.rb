# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'faker'
require 'pry'

Favorite.delete_all
# Track.delete_all
# User.delete_all

# users_name = [
#     'Natalie',
#     'Prince',
#     'Dick',
#     'Rachel',
#     'Garry',
#     'Jason',
#     'Matt',
#     'Niky',
#     'Ashley'
#   ]
   

# users_name.each do |name|
#     User.create(username: name)
# end

# 30.times {
#    Track.create(title: Faker::Quote.unique.yoda, length: rand(2..30))
# }

10.times {
    Favorite.create(user_id: User.all.sample.id, track_id: Track.all.sample.id)
}

