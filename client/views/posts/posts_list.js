Template.posts_list.helpers({
  posts: function() {
    return this.fetch();
  },
  postsReady: function() {
    return this.ready();
  },
  allPostsLoaded: function(){
    allPostsLoaded = this.fetch().length < this.loaded();
    Session.set('allPostsLoaded', allPostsLoaded);
    return allPostsLoaded;  
  }
});

Template.posts_list.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
}

Template.posts_list.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('currentScroll',$('body').scrollTop());
    this.loadNextPage();
  }
});

