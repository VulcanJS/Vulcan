import Campaign from "./campaign.js";
import MailChimpList from "./mailchimp.js";

Meteor.methods({
  sendCampaign: function () {
    if(Users.is.adminById(this.userId))
      return Campaign.scheduleNextWithMailChimp(false);
  },
  testCampaign: function () {
    if(Users.is.adminById(this.userId))
      return Campaign.scheduleNextWithMailChimp(true);
  },
  'newsletter.addUser'(user){
    if (!user || !Users.can.editById(this.userId, user)) {
      throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_user'));
    }
    
    try {
      return MailChimpList.add(user, false);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  },
  'newsletter.removeUser'(user) {
    if (!user || !Users.can.editById(this.userId, user)) {
      throw new Meteor.Error(601, __('sorry_you_cannot_edit_this_user'));
    }
    
    try {
      return MailChimpList.remove(user);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  },
  'newsletter.addEmail'(email) {
    if(Users.is.adminById(this.userId)) {
      try {
        return MailChimpList.add(email, true);
      } catch (error) {
        throw new Meteor.Error(500, error.message);
      }
    }
  }
});
