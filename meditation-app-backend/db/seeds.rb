# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

require 'csv'


Favorite.delete_all
Track.delete_all
User.delete_all

users_name = [
    'natalie',
    'prince',
    'dick',
    'rachel',
    'garry',
    'jason',
    'matt',
    'niky',
    'ashley',
    'abc'
  ]
   
users_name.each do |name|
    User.create(username: name)
end

CSV.foreach('../meditation-app-frontend/tracks/Tracklist.csv', :headers => true) do |row|
    Track.create!(row.to_hash)
end
  
10.times {
    Favorite.create(user_id: User.all.sample.id, track_id: Track.all.sample.id)
}

