(function(){
  var editor;

  Template.comment_edit.events = {
    'click input[type=submit]': function(e){
      e.preventDefault();
      if(!Meteor.user()) throw 'You must be logged in.';

      var selected_comment_id=Session.get("selected_comment_id");
      var selected_post_id=Comments.findOne(selected_comment_id).post;
      var body = editor.exportFile();

      var comment_id = Comments.update(selected_comment_id,
   		{
  	   		$set: {
  		      body: body
  	    	}
      	}
      );
      Router.navigate("posts/"+selected_post_id, {trigger:true});
    }

    , 'click .delete-link': function(e){
        e.preventDefault();
        if(confirm("Are you sure?")){
          var selected_comment_id=Session.get("selected_comment_id");
          Comments.remove(selected_comment_id);
          Router.navigate("comments/deleted", {trigger:true});
        }
    }

  };

  Template.comment_edit.comment = function(){
    var comment= Comments.findOne(Session.get('selected_comment_id'));
    return comment;
  };

  Template.comment_edit.rendered = function(){
    var comment= Comments.findOne(Session.get('selected_comment_id'));
    if(comment){
      editor= new EpicEditor({
      container:  'editor',
      basePath:   '/editor',
      clientSideStorage: false,
      theme: {
        base:'/themes/base/epiceditor.css',
        preview:'/themes/preview/github.css',
        editor:'/themes/editor/epic-light.css'
      }
      }).load();  
      editor.importFile('editor',comment.body);
    }
  }
})();
