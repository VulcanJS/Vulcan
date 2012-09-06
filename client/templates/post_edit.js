Template.selected_post.events = {
  'click input[type=submit]': function(e){
    e.preventDefault();

    var post = Posts.findOne(Session.get('selected_post_id'));
    var $comment = $('#comment');
    Meteor.call('comment', post, null, $comment.val());
    $comment.val('');
  }
};

Template.post_edit.post = function(){
  var post = Posts.findOne(Session.get('selected_post_id'));
  return post;
};
