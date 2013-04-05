Template.toolbox.events= {
  'click .update-categories':function(){
  var comments=Comments.find().fetch();
  $.each(comments, function(index, element){

    if(!element.userId){
      Comments.update(element._id,{$set:{userId:element.user_id}}, function(error){
        console.log(error);
      });
    }
    console.log(element);

  });
  }
}