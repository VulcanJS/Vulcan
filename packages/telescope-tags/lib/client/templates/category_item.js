Meteor.startup(function () {
  Template.category_item.helpers({
    formId: function () {
      return 'updateCategory-'+ this._id;
    }
  });

  Template.category_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();

      var categoryId = instance.data._id;

      if (confirm("Delete category?")) {
        Meteor.call("removeCategory", categoryId);
      }
    }
  });
});
