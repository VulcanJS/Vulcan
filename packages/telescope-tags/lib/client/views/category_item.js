Meteor.startup(function () {
  Template[getTemplate('categoryItem')].helpers({
    formId: function () {
      return 'updateCategory-'+ this._id
    }
  });

  Template[getTemplate('categoryItem')].events({
    'click .delete-link': function(e, instance){
      e.preventDefault();
      if (confirm("Delete category?")) {
        Categories.remove(instance.data._id);
      }
    }
  });
});
