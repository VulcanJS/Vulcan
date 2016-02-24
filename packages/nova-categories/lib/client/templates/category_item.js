Meteor.startup(function () {
  Template.category_item.helpers({
    category: function () {
      return this.item.data;
    },
    formId: function () {
      return 'updateCategory-'+ this.item.data._id;
    }
  });

  Template.category_item.events({
    'click .delete-link': function(e, instance){
      e.preventDefault();

      var category = instance.data.item.data;

      if (confirm("Delete category “"+category.name+"”?")) {
        Meteor.call("removeCategory", category._id, function (error, result) {
          Messages.flash("Deleted category “"+category.name+"” and removed it from "+result+" posts");
        });
      }
    }
  });
});
