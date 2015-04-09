Meteor.startup(function () {

  Router.route('/email/campaign', {
    name: 'campaign',
    where: 'server',
    action: function() {
      var campaign = buildCampaign(getCampaignPosts(Settings.get('postsPerNewsletter', 5)));
      var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
      var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+ Meteor.call('getNextJob') +'</div>';

      this.response.write(campaignSubject+campaignSchedule+campaign.html);
      this.response.end();
    }
  });

  Router.route('/email/digest-confirmation', {
    name: 'digestConfirmation',
    where: 'server',
    action: function() {
      var confirmationHtml = getEmailTemplate('emailDigestConfirmation')({
        time: 'January 1st, 1901',
        newsletterLink: 'http://example.com',
        subject: 'Lorem ipsum dolor sit amet'
      });
      this.response.write(buildEmailTemplate(confirmationHtml));
      this.response.end();
    }
  });

});
