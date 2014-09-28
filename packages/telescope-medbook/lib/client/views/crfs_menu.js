Meteor.startup(function () {
  Template[getTemplate('crfsMenu')].helpers({
    hasCRFs: function(){
      return typeof CRFs !== 'undefined' && CRFs.find().count();
    },
    crfs: function(){
      return CRFs.find({}, {sort: {order: 1, name: 1}});
    },
    crfLink: function () {
      return getCRFUrl(this.slug);
    }
  });
});
