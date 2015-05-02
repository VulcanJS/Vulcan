Meteor.startup(function () {
  Template.categoryItem.helpers({
    formId: function () {
      return 'updateCategory-'+ this._id;
    }
  });

  Template.categoryItem.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete category?")) {
        Categories.remove(instance.data._id);
      }
    }
  });
});
