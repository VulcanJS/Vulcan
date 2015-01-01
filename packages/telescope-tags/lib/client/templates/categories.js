Meteor.startup(function () {
  Template[getTemplate('categories')].helpers({
    categories: function(){
      return Categories.find({}, {sort: {order: 1, name: 1}});
    },
    categoryItem: function () {
      return getTemplate('categoryItem');
    }
  });

  Template[getTemplate('categories')].events({
    'click input[type=submit]': function(e){
      e.preventDefault();

      var name = $('#name').val();
      var numberOfCategories = Categories.find().count();
      var order = parseInt($('#order').val()) || (numberOfCategories + 1);
      var slug = slugify(name);
      
      Meteor.call('submitCategory', {
        name: name,
        order: order,
        slug: slug
      }, function(error, categoryName) {
        if(error){
          console.log(error);
          flashMessage(error.reason, "error");
          clearSeenMessages();
        }else{
          $('#name').val('');
          // flashMessage('New category "'+categoryName+'" created', "success");
        }
      });
    }
  });
});
