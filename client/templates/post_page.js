Template.post_page.post = function(){
  var post = Posts.findOne(Session.get('selectedPostId'));
  return post;
};

Template.post_page.body_formatted = function(){
  var converter = new Markdown.Converter();
  var html_body=converter.makeHtml(this.body);
  return html_body.autoLink();
}

window.newCommentTimestamp=new Date();