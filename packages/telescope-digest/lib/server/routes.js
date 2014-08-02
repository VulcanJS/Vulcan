
Meteor.startup(function () {

  Router.map(function() {

    this.route('campaign', {
      where: 'server',
      path: '/campaign/:id?',
      action: function() {
        var campaignId = parseInt(this.params.id);
        var htmlContent = buildCampaign(2);
        this.response.write(htmlContent);
        this.response.end();
      }
    });

  });

});