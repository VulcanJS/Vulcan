Meteor.startup(function () {
  Template[getTemplate('postCRFs')].helpers({
    crfLink: function(){
      return getCRFUrl(this.slug);
    }
  });
});
