class UpdateLengthInTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :tracks, :length_in_seconds, :integer
    remove_column :tracks, :length, :integer
  end
end
