Template.comment_item.events = {
  'click .goto-comment': function(event){
    event.preventDefault();
    var href=event.target.href.replace(/^(?:\/\/|[^\/]+)*\//, "");

    Session.set('selected_comment', this);
    // Session.set('state', 'reply');
    Router.navigate(href, {trigger: true});
  },
  'click .open-comment-link': function(e){
    e.preventDefault();
    console.log('clicked me', event.target, $(event.target).closest(".comment"));
    $(event.target).closest(".comment").removeClass("queued");
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
  if(this.body){
    var converter = new Markdown.Converter();
    var html_body=converter.makeHtml(this.body);
    return html_body.autoLink();
  }
}

Template.comment_item.helpers({
  isNew: function() {
    // the user's own comments are never queued
    if(Meteor.user()._id!=this.user_id && Session.get('StyleNewRecords'))
      return (new Date(this.submitted)) > Session.get('StyleNewRecords');
    return false;
  },
  repress_recursion: function(){
    if(window.repress_recursion){
      return true;
    }
    return false;
  }
});