Template.post_page.created = function(){
	var postsView={
	  find: {_id:Session.get('selectedPostId')},
	  sort: {},
	  skip:0,
	  postsPerPage:1,
	  limit:1
	}
	sessionSetObject('postsView', postsView);
};

Template.post_page.helpers({
	post: function(){
		var post = Posts.findOne(Session.get('selectedPostId'));
		return post;
	},
	body_formatted: function(){
		var converter = new Markdown.Converter();
		var html_body=converter.makeHtml(this.body);
		return html_body.autoLink();
	},
	canComment: function(){
		return canComment(Meteor.user());
	},
	canView: function(){
		return canView(Meteor.user());
	}
}); 

Template.post_page.rendered = function(){
	if((scrollToCommentId=Session.get('scrollToCommentId')) && !this.rendered && $('#'+scrollToCommentId).exists()){
		scrollPageTo('#'+scrollToCommentId);
		Session.set('scrollToCommentId', null);
		this.rendered=true;
	}
}

window.newCommentTimestamp=new Date();
