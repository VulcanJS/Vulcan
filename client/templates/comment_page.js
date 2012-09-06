Template.comment_page.events = {
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

Template.comment_page.show = function(){
  return Session.equals('state', 'reply');
};

Template.comment_page.show_comment_form = function(){
  return Meteor.user() !== null;
};

Template.comment_page.postLoaded = function(){
  var selected_comment = Comments.findOne(Session.get('selected_comment_id'));
  if(selected_comment){
    return true;
  }else{
    return false;
  }
}

Template.comment_page.post = function(){
  var selected_comment = Comments.findOne(Session.get('selected_comment_id'));
  if(selected_comment){
    var post = selected_comment.post;
    return Posts.findOne(post);
  }
};

Template.comment_page.comment = function(){
  var comment = Comments.findOne({_id:Session.get('selected_comment_id')});
  Template.comment_page.repress_recursion = true;
  return comment;
};
