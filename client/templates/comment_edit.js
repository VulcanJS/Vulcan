Template.comment_edit.helpers({
	comment:function(){
		return Comments.findOne(Session.get('selected_comment_id'));
	}
});

Template.comment_edit.rendered = function(){
	var comment= Comments.findOne(Session.get('selected_comment_id'));
	if(comment && Meteor.user() && !this.editor){
		this.editor = new EpicEditor(EpicEditorOptions).load();
		this.editor.importFile('editor',comment.body);
	}
}

Template.comment_edit.events = {
	'click input[type=submit]': function(e, instance){
		e.preventDefault();
		if(!Meteor.user()) throw 'You must be logged in.';

		var selected_comment_id=Session.get("selected_comment_id");
		var selected_post_id=Comments.findOne(selected_comment_id).post;
		var content = instance.editor.exportFile();

		var comment_id = Comments.update(selected_comment_id,
		{
				$set: {
					body: content
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




