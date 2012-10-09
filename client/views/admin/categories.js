Template.categories.helpers({
  categories: function(){
    return Categories.find();
  }
});

Template.categories.events({
  'click input[type=submit]': function(e){
    e.preventDefault();

    $(e.target).addClass('disabled');

    var name= $('#name').val();
    
    Meteor.call('category', {
      name: name
    }, function(error, categoryName) {
      if(error){
        console.log(error);
        throwError(error.reason);
        clearSeenErrors();
        $(e.target).removeClass('disabled');
      }else{
        $('#name').val('');
        throwError('New category "'+categoryName+'" created');
      }
    });
  }
})