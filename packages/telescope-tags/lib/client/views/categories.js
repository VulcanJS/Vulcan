Template.categories.helpers({
  categories: function(){
    return Categories.find({}, {sort: {name: 1}});
  }
});

Template.categories.events({
  'click input[type=submit]': function(e){
    e.preventDefault();

    var name = $('#name').val();
    var slug = slugify(name);
    
    Meteor.call('category', {
      name: name,
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
})