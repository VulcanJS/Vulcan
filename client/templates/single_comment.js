Template.single_comment.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();

    var post = Session.get('selected_post');
    var post_id=Session.get('selected_post_id');
    var parentComment = Session.get('selected_comment');
    var $comment = $('#comment');
    Meteor.call('comment', post, parentComment, $comment.val());

    Session.set('selected_comment', null);
    // Session.set('state', 'view_post');
    Router.navigate('posts/'+post_id, {trigger:true});
  }
};

Template.single_comment.show = function(){
  return Session.equals('state', 'reply');
};

Template.single_comment.show_comment_form = function(){
  return Meteor.user() !== null;
};

Template.single_comment.postLoaded = function(){
  var selected_comment = Comments.findOne(Session.get('selected_comment_id'));
  if(selected_comment){
    return true;
  }else{
    return false;
  }
}

Template.single_comment.post = function(){
  var selected_comment = Comments.findOne(Session.get('selected_comment_id'));
  if(selected_comment){
    var post = selected_comment.post;
    return Posts.findOne(post);
  }
};

Template.single_comment.comment = function(){
  var comment = Comments.findOne({_id:Session.get('selected_comment_id')});
  Template.single_comment.repress_recursion = true;
  return comment;
};
