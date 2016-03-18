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
  addCurrentUserToMailChimpList: function(){
    var currentUser = Meteor.users.findOne(this.userId);
    try {
      return MailChimpList.add(currentUser, false);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  },
  addEmailToMailChimpList: function (email) {
    try {
      return MailChimpList.add(email, true);
    } catch (error) {
      throw new Meteor.Error(500, error.message);
    }
  }
});
