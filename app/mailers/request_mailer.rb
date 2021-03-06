class RequestMailer < ApplicationMailer
  def new_request_email
    @artist = params[:artist]
    @buyer = params[:buyer]
    @work = params[:work]
    mail(to: @artist.email, subject: 'New Request Opened')
  end

  def request_closed_email
    @artist = params[:artist]
    @buyer = params[:buyer]
    @work = params[:work]
    mail(to: @buyer.email, subject: 'Request Closed')
  end

  def request_completed_email
    @artist = params[:artist]
    @buyer = params[:buyer]
    @work = params[:work]
    mail(to: @buyer.email, subject: 'Request Completed')
  end

  def request_deleted_email
    @artist = params[:artist]
    @buyer = params[:buyer]
    @title = params[:title]
    mail(to: @buyer.email, subject: 'Request Deleted')
  end
end
