Meteor.startup(function () {
  Template[getTemplate('pageItem')].helpers({
    formId: function () {
      return 'updatePage-'+ this._id
    }
  });

  Template[getTemplate('pageItem')].events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete page?")) {
        Pages.collection.remove(instance.data._id);
      }
    }
  });
});
