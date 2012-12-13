Template.posts_top.topPostsHandle = function() { 
  return topPostsHandle;
}
Template.posts_new.newPostsHandle = function() { 
  return newPostsHandle;
}
Template.posts_best.bestPostsHandle = function() { 
  return bestPostsHandle;
}
Template.posts_pending.pendingPostsHandle = function() { 
  return pendingPostsHandle;
}

Template.posts_list.helpers({
  posts: function() {
    return this.fetch();
  },
  postsReady: function() {
    return ! this.loading();
  },
  allPostsLoaded: function(){
    return this.fetch().length < this.loaded()
  }
});

Template.posts_list.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  $('body').css('min-height',distanceFromTop+160);
  $('.more-button').css('top', distanceFromTop+"px");  
}

Template.posts_list.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    this.loadNextPage();
  }
});

