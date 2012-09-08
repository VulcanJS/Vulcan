Template.comment_page.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();

    var parentComment_id = Session.get('selected_comment_id');
    var post_id=Comments.findOne(parentComment_id).post;

    var $comment = $('#comment');
    var comment_id= Meteor.call('comment', post_id, parentComment_id, $comment.val());

    console.log(comment_id);
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
  console.log(selected_comment);
  if(selected_comment){
    var post = selected_comment.post;
    return Posts.findOne(post);
  }
};

Template.comment_page.comment = function(){
  var comment = Comments.findOne(Session.get('selected_comment_id'));
  Template.comment_page.repress_recursion = true;
  return comment;
};
