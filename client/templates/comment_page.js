

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
  var comment = Comments.findOne(Session.get('selected_comment_id'));
  Template.comment_page.repress_recursion = true;
  return comment;
};