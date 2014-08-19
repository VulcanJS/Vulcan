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
      
      Meteor.call('category', {
        name: name,
        order: order,
        slug: slug
      }, function(error, categoryName) {
        if(error){
          console.log(error);
          throwError(error.reason);
          clearSeenErrors();
        }else{
          $('#name').val('');
          // throwError('New category "'+categoryName+'" created');
        }
      });
    }
  });
});