
Meteor.startup(function () {

  Router.map(function() {

    this.route('campaign', {
      where: 'server',
      path: '/email/campaign/:id?',
      action: function() {
        var campaignId = parseInt(this.params.id);
        var htmlContent = buildCampaign(5);
        this.response.write(htmlContent);
        this.response.end();
      }
    });

  });

});