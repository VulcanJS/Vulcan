Meteor.startup(function () {
  Template.pageItem.helpers({
    formId: function () {
      return 'updatePage-'+ this._id
    }
  });

  Template.pageItem.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete page?")) {
        Pages.collection.remove(instance.data._id);
      }
    }
  });
});
