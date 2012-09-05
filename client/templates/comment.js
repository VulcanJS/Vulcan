Template.comment.events = {
  'click .goto-comment': function(event){
    event.preventDefault();
    var href=event.target.href.replace(/^(?:\/\/|[^\/]+)*\//, "");

    Session.set('selected_comment', this);
    // Session.set('state', 'reply');
    Router.navigate(href, {trigger: true});
  }
};

Template.comment.ago = function(){
  var submitted = new Date(this.submitted);
  return submitted.toString();
};

Template.comment.child_comments = function(){
  var post_id = Session.get('selected_post_id');
  var comments = Comments.find({ post: post_id, parent: this._id });
  return comments;
};
