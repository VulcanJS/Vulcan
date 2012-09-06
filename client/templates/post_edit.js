Template.post_edit.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var selected_post_id=Session.get("selected_post_id");
    var title= $('#title').val();
    var url = $('#url').val();
    var body = $('#body').val();

    Posts.update(selected_post_id,
 		{
	   		$set: {
		        headline: title
		      , url: url
		      , body: body
	    	}
    	}
    );
    Router.navigate("posts/"+selected_post_id, {trigger:true});
  }
};

Template.post_edit.post = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return post;
};
