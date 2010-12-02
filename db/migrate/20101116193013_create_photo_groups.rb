class CreatePhotoGroups < ActiveRecord::Migration
  def self.up
    create_table :photo_groups do |t|
      t.integer :identifier, :limit => 8
      
      t.timestamps
    end
  end

  def self.down
    drop_table :photo_groups
  end
end
