(function(){

  commentIsNew=function(comment){
    var commentIsNew=false;
    var d=new Date(comment.submitted);
    commentIsNew=d > window.newCommentTimestamp;
    console.log("body: "+comment.body+" | comment submission date: "+d+" |  newCommentTimestamp: "+window.newCommentTimestamp+" | isNew: "+commentIsNew);
    if(Meteor.user() && Meteor.user()._id==comment.user_id){
      // if user is logged in, and the comment belongs to the user, then never queue it
      return false;
    }
    // else, check if comment is newer than the global new comment timestamp, and return the result
    return commentIsNew;
  };

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
      $(event.target).closest(".comment").removeClass("queued");
    },
    'click .queue-comment': function(e){
      e.preventDefault();
      var current_comment_id=$(event.target).closest(".comment").attr("id");
    var now = new Date();
    console.log("now: ", now.toString());   
    var comment_id = Comments.update(current_comment_id,
        {
          $set: {
            submitted:  new Date().getTime()
          }
        }
      );
      // $(event.target).closest(".comment").addClass("queued");
    }
  };

  Template.comment_item.full_date = function(){
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
})();

Template.comment_item.rendered=function(){
  // t("comment_item");
  if(this.data){
    var comment=this.data;
    if(Meteor.users.findOne(comment.user_id)){
      var author=Meteor.users.findOne(comment.user_id).username;
    }
    console.log(comment);
    var $comment=$("#"+comment._id);
    var $commentParentList=$comment.closest(".comment-list");
    if(commentIsNew(comment)){
      $comment.addClass("queued");
      if(!$commentParentList.hasClass("has-queued-comments")){
        $commentParentList.addClass("has-queued-comments").prepend('<div class="queued-comments"></div>');
      }
      $commentParentList.find(".queued-comments").append('<a href="#">'+author+'</a>');
    }
  }
}

Template.comment_item.helpers({
  isQueued: function() {
    commentIsNew(this);
  },
  repress_recursion: function(){
    if(window.repress_recursion){
      return true;
    }
    return false;
  },
  ago: function(){
    var submitted = new Date(this.submitted);
    var timeAgo=jQuery.timeago(submitted);
    return timeAgo;
  }
});