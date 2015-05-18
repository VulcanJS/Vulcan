Meteor.startup(function () {
  Template.category_item.helpers({
    formId: function () {
      return 'updateCategory-'+ this._id;
    }
  });

  Template.category_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete category?")) {
        Categories.remove(instance.data._id);
      }
    }
  });
});
