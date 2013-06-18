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
		console.log('asdas')
		console.log(canView(Meteor.user()))
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