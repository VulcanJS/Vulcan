Template.comment_item.events = {
  'click .goto-comment': function(event){
    event.preventDefault();
    var href=event.target.href.replace(/^(?:\/\/|[^\/]+)*\//, "");

    Session.set('selected_comment', this);
    // Session.set('state', 'reply');
    Router.navigate(href, {trigger: true});
  }
};

Template.comment_item.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};

Template.comment_item.child_comments = function(){
  var post_id = Session.get('selected_post_id');
  var comments = Comments.find({ post: post_id, parent: this._id });
  return comments;
};

Template.comment_item.author = function(){
  if(Meteor.users.findOne(this.user_id)){
    return Meteor.users.findOne(this.user_id).username;
  }
};

Template.comment_item.is_my_comment = function(){
  if(this.user_id && Meteor.user() && Meteor.user()._id==this.user_id){
    return true;
  }
  return false;
};

Template.comment_item.body_formatted = function(){
  var converter = new Markdown.Converter();
  var html_body=converter.makeHtml(this.body);
  return html_body.autoLink();
}