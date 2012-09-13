(function(){
  var editor;

Template.post_edit.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();
    if(!Meteor.user()) throw 'You must be logged in.';

    var selected_post_id=Session.get("selected_post_id");
    var title= $('#title').val();
    var url = $('#url').val();
    var body = editor.exportFile();
    console.log("body:   ", body)

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

  , 'click .delete-link': function(e){
    e.preventDefault();
    if(confirm("Are you sure?")){
      var selected_post_id=Session.get("selected_post_id");
      Posts.remove(selected_post_id);
      Router.navigate("posts/deleted", {trigger:true});
    }
  }
};

Template.post_edit.post = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return post;
};

Template.post_edit.rendered = function(){
  var post= Posts.findOne(Session.get('selected_post_id'));
  if(post){
    editor= new EpicEditor(EpicEditorOptions).load();  
    editor.importFile('editor',post.body);
  }
}

})();