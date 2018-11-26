require_dependency '../validators/email_validator.rb'
class Artist < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  validates :email, :presence => true, :email => true
  devise :confirmable, :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :works
  has_many :requests
  has_many :transactions
  has_many :buyers, through: :commissions
  has_one_attached :pro_pic
  validates :name, presence: true, uniqueness: true
end
