
Meteor.startup(function () {

  Router.map(function() {

    this.route('campaign', {
      where: 'server',
      path: '/email/campaign',
      action: function() {
        var campaign = buildCampaign(getCampaignPosts(getSetting('postsPerNewsletter', 5)));
        var campaignSubject = '<div class="campaign-subject"><strong>Subject:</strong> '+campaign.subject+' (note: contents might change)</div>';
        var campaignSchedule = '<div class="campaign-schedule"><strong>Scheduled for:</strong> '+getNextCampaignSchedule()+'</div>';

        this.response.write(campaignSubject+campaignSchedule+campaign.html);
        this.response.end();
      }
    });

    this.route('digestConfirmation', {
      where: 'server',
      path: '/email/digest-confirmation',
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

});