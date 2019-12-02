class AddCategoryAndFilepathToTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :tracks, :category, :string
    add_column :tracks, :filepath, :string
  end
end
