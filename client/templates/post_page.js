(function() {


Template.post_page.post = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return post;
};

Template.post_page.body_formatted = function(){
  var converter = new Markdown.Converter();
  var html_body=converter.makeHtml(this.body);
  return html_body.autoLink();
}

Template.post_page.rendered = function(){
  // t("post_page");
}

window.newCommentTimestamp=new Date();

})();