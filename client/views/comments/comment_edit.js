var editComment = function(instance) {
  var comment = instance.data.comment;
  var content = instance.$('#body').val();


  if(!Meteor.user())
    throw i18n.t('you_must_be_logged_in');

  Comments.update(comment._id, {
    $set: {
      body: content
    }
  });

  trackEvent("edit comment", {'postId': comment.postId, 'commentId': comment._id});
  Router.go('post_page_comment', {_id: comment.postId, commentId: comment._id});
};

Template.comment_edit.onRendered(function() {
  var self = this;
  this.$("#comment").keydown(function (e) {
    if(((e.metaKey || e.ctrlKey) && e.keyCode == 13) || (e.ctrlKey && e.keyCode == 13)){
      editComment(self);
    }
  });
});

Template.comment_edit.events({
  'click input[type=submit]': function(e, instance){
    e.preventDefault();
    editComment(instance);
  },
  'click .delete-link': function(e){
    var comment = this;

    e.preventDefault();

    if(confirm(i18n.t("are_you_sure"))){
      Meteor.call('removeComment', comment._id);
      Router.go('post_page', {_id: comment.postId});
      Messages.flash("Your comment has been deleted.", "success");
    }
  }
});
