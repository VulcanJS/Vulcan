Template.toolbox.events= {
  'click .update-categories':function(){
  var posts=Posts.find().fetch();
  $.each(posts, function(index, element){

    if(element.categories){
      console.log('Found categories for post "'+element.headline+'"');
      $.each(element.categories)
    Posts.update(element._id,{$set:{userId:element.user_id}}, function(error){
      console.log(error);
    });

    console.log(element);
    }
  });
  }
}