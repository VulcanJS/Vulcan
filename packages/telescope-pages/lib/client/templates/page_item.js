Meteor.startup(function () {
  Template.page_item.helpers({
    formId: function () {
      return 'updatePage-'+ this._id
    }
  });

  Template.page_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete page?")) {
        Pages.remove(instance.data._id);
      }
    }
  });
});
