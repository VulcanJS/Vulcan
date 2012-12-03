(function(){

  commentIsNew=function(comment){
    var d=new Date(comment.submitted);
    var commentIsNew=d > new Date(Session.get('requestTimestamp'));
    // console.log("------------\n body: "+comment.body+" \n comment submission date: "+d+" \n  requestTimestamp: "+new Date(Session.get('requestTimestamp'))+" \n now: "+new Date()+"\nisNew: "+commentIsNew);
    return commentIsNew;
  };

  findQueueContainer=function($comment){
    // go up and down the DOM until we find either A) a queue container or B) an unqueued comment
    $up=$comment.prevAll(".queue-container, .comment-displayed").first();
    $down=$comment.nextAll(".queue-container, .comment-displayed").first();
    $prev=$comment.prev();
    $next=$comment.next();
    $queuedAncestors=$comment.parents(".comment-queued");
    if($queuedAncestors.exists()){
      // console.log("----------- case 1: Queued Ancestor -----------");
      // 1.
      // our comment has one or more queued ancestor, so we look for the root-most
      // ancestor's queue container
      $container=$queuedAncestors.last().data("queue");
    }else if($prev.hasClass("queue-container")){
      // console.log("----------- case 2: Queued Brother -----------");
      // 2.
      // the comment just above is queued, so we use the same queue container as him
      $container=$prev.data("queue");
    }else if($prev.find(".comment").last().hasClass("comment-queued")){
      // console.log("----------- case 3: Queued Cousin -----------");
      // 3.
      // there are no queued comments going up on the same level,
      // but the bottom-most child of the comment directly above is queued
      $container=$prev.find(".comment").last().data("queue");
    }else if($down.hasClass("queue-container")){
      // console.log("----------- case 4: Queued Sister -----------");
      // 3.
      // the comment just below is queued, so we use the same queue container as him
      $container=$next.data("queue");
    }else if($up.hasClass('comment-displayed') || !$up.exists()){
      // console.log("----------- case 5: No Queue -----------");
      // 4.
      // we've found containers neither above or below, but
      // A) we've hit a displayed comment or
      // B) we've haven't found any comments (i.e. we're at the beginning of the list)
      // so we put our queue container just before the comment
      $container=$('<div class="queue-container"><ul></ul></div>').insertBefore($comment);
      $container.click(function(e){
        e.preventDefault();
        var links=$(this).find("a");
        links.each(function(){
          var target=$(this).attr("href");
          $(target).removeClass("comment-queued").addClass("comment-displayed");
          var openedComments=Session.get('openedComments') || [];
          openedComments.push(target.substr(1));
          Session.set('openedComments', openedComments);
          // console.log(Session.get('openedComments'));
        });
        // scrollPageTo(links.first().attr("href"));
        $(this).hide("slow").remove();
      });
    }
    // console.log("comment", $comment);
    // console.log("up", $up);
    // console.log("down", $down);
    // console.log("queuedAncestors", $queuedAncestors);
    // console.log("container", $container);
    return $container;
  };

  Template.comment_item.helpers({
    full_date: function(){
      var submitted = new Date(this.submitted);
      return submitted.toString();
    }
    ,child_comments: function(){
      var post_id = Session.get('selectedPostId');
      var comments = Comments.find({ post: post_id, parent: this._id });
      return comments;
    }
    ,author: function(){
      return Meteor.users.findOne(this.userId);
    }
    ,authorName: function(){
      return getAuthorName(this);
    },
    user_avatar: function(){
      if(author=Meteor.users.findOne(this.userId))
        return getAvatarUrl(author);
    }  
    ,can_edit: function(){
      if(this.userId && Meteor.userId())
        return Meteor.user().isAdmin || (Meteor.userId() === this.userId);
      else
        return false;
    }
    ,body_formatted: function(){
      if(this.body){
        var converter = new Markdown.Converter();
        var html_body=converter.makeHtml(this.body);
        return html_body.autoLink();
      }
    }
    ,showChildComments: function(){
      return Session.get('showChildComments');
    }
    ,ago: function(){
      return moment(this.submitted).fromNow();
    }
    ,upvoted: function(){
      return Meteor.user() && _.include(this.upvoters, Meteor.user()._id);
    }
    ,downvoted: function(){
      return Meteor.user() && _.include(this.downvoters, Meteor.user()._id);
    }
  });

Template.comment_item.created=function(){
  // this.firstRender=true;
}

Template.comment_item.rendered=function(){
  // t("comment_item");
  if(this.data){
    var comment=this.data;
    var $comment=$("#"+comment._id);
    var openedComments=Session.get('openedComments') || [];

    if(Meteor.user() && Meteor.user()._id==comment.userId){
      // if user is logged in, and the comment belongs to the user, then never queue it
    }else{
      if(commentIsNew(comment) && !$comment.hasClass("comment-queued") && openedComments.indexOf(comment._id)==-1){
        // if comment is new and has not already been previously queued
        // note: testing on the class works because Meteor apparently preserves newly assigned CSS classes
        // across template renderings
        // TODO: save scroll position
        if(Meteor.users.findOne(comment.userId)){
          // get comment author name
          var user=Meteor.users.findOne(comment.userId);
          var author=getDisplayName(user);

          var imgURL=getAvatarUrl(user);
        var $container=findQueueContainer($comment);
        var comment_link='<li class="icon-user"><a href="#'+comment._id+'" class="has-tooltip" style="background-image:url('+imgURL+')"><span class="tooltip"><span>'+author+'</span></span></a></li>';
        if(this.firstRender){
          // TODO: fix re-rendering problem with timer
          $(comment_link).appendTo($container.find("ul")).hide().fadeIn("slow");
          this.firstRender=false;
        }else{
          $(comment_link).appendTo($container.find("ul"));
        }
        $comment.removeClass("comment-displayed").addClass("comment-queued");
        $comment.data("queue", $container);
        // TODO: take the user back to their previous scroll position
         }
        }
      }
    }
  }

  Template.comment_item.events = {
    'click .queue-comment': function(e){
      e.preventDefault();
      var current_comment_id=$(event.target).closest(".comment").attr("id");
      var now = new Date();
      var comment_id = Comments.update(current_comment_id,
          {
            $set: {
              submitted:  new Date().getTime()
            }
          }
        );
      },
    'click .not-upvoted .upvote': function(e, instance){
      e.preventDefault();
      if(!Meteor.user()){
        throwError("Please log in first");
        return false;
      }
      Meteor.call('upvoteComment', this._id, function(error, result){
        trackEvent("post upvoted", {'commentId':instance.data._id, 'postId': instance.data.post, 'authorId':instance.data.userId});
      });
    },
    'click .upvoted .upvote': function(e, instance){
      e.preventDefault();
      if(!Meteor.user()){
        throwError("Please log in first");
        return false;
      }
      Meteor.call('cancelUpvoteComment', this._id, function(error, result){
        trackEvent("post upvote cancelled", {'commentId':instance.data._id, 'postId': instance.data.post, 'authorId':instance.data.userId});
      });
    },
    'click .not-downvoted .downvote': function(e, instance){
      e.preventDefault();
      if(!Meteor.user()){
        throwError("Please log in first");
        return false;
      }
      Meteor.call('downvoteComment', this._id, function(error, result){
        trackEvent("post downvoted", {'commentId':instance.data._id, 'postId': instance.data.post, 'authorId':instance.data.userId});
      });
    },
    'click .downvoted .downvote': function(e, instance){
      e.preventDefault();
      if(!Meteor.user()){
        throwError("Please log in first");
        return false;
      }
      Meteor.call('cancelDownvoteComment', this._id, function(error, result){
        trackEvent("post downvote cancelled", {'commentId':instance.data._id, 'postId': instance.data.post, 'authorId':instance.data.userId});
      });
    }
  };

})();