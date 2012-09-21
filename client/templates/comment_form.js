(function(){

	// var editor;

	Template.comment_form.show_comment_form = function(){
	  return Meteor.user() !== null;
	};

	Template.comment_form.rendered = function(){
	  // t("post_page");
	  if(Meteor.user() && !this.editor){
	    this.editor = new EpicEditor(EpicEditorOptions).load();
	  }
	}

	Template.comment_form.events = {
	  'click input[type=submit]': function(e, instance){
	    e.preventDefault();
		var $comment = $('#comment');
		var content = instance.editor.exportFile();

	    if(selected_comment_id=Session.get('selected_comment_id')){
	    	// post a child comment
		    var parent_comment_id =selected_comment_id;
		    var post_id=Comments.findOne(parent_comment_id).post;
	        Meteor.call('comment', post_id, parent_comment_id, content);
	        Session.set('selected_comment_id', null);
	    	Router.navigate('posts/'+post_id, {trigger:true});
	    }else{
	    	// post a root comment
	    	var parent_comment_id=null;
	    	var post_id=Session.get('selected_post_id');
	        Meteor.call('comment', post_id, parent_comment_id, content);
	        $comment.val('');
	    }
	  }
	};
})();
