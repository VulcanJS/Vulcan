
Meteor.startup(function () {

  Router.map(function() {

    this.route('campaign', {
      where: 'server',
      path: '/email/campaign',
      action: function() {
        var campaign = buildCampaign(getCampaignPosts(getSetting('postsPerNewsletter', 5)));
        console.log('Previewing campaign subject: '+campaign.subject);
        this.response.write(campaign.html);
        this.response.end();
      }
    });

    this.route('digestConfirmation', {
      where: 'server',
      path: '/email/digest-confirmation',
      action: function() {
        var confirmationHtml = Handlebars.templates[getTemplate('emailDigestConfirmation')]({
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