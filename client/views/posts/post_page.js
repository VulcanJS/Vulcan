Template.post_page.helpers({
  post: function () {
    return Posts.findOne(this.postId);
  },
  body_formatted: function(){
    var converter = new Markdown.Converter();
    var html_body=converter.makeHtml(this.body);
    return html_body.autoLink();
  },
  canComment: function(){
    return canComment(Meteor.user());
  }
}); 

Template.post_page.rendered = function(){
  if((scrollToCommentId=Session.get('scrollToCommentId')) && !this.rendered && $('#'+scrollToCommentId).exists()){
    scrollPageTo('#'+scrollToCommentId);
    Session.set('scrollToCommentId', null);
    this.rendered=true;
  }
  if(this.data) // XXX
    document.title = this.data.headline;
}
