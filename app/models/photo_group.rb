class PhotoGroup < ActiveRecord::Base
  include TimelineDetails
  
  belongs_to :authentication
  has_many :photos, :after_remove => :destroy_if_empty
  
  private
  
  def destroy_if_empty(photo)
    destroy if photos.empty?
  end
end
