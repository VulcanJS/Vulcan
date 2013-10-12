Template.posts_list.helpers({
  posts: function() {
    console.log(postsSubscriptions[Session.get('view')])
    return postsSubscriptions[Session.get('view')].fetch();
  },
  postsReady: function() {
    return postsSubscriptions[Session.get('view')].ready();
  },
  allPostsLoaded: function(){
    allPostsLoaded = postsSubscriptions[Session.get('view')].fetch().length < postsSubscriptions[Session.get('view')].loaded();
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
    postsSubscriptions[Session.get('view')].loadNextPage();
  }
});

