Template.posts_best.helpers({
  // posts: function() {
  //   // console.log(Session.get('view'))
  //   // console.log(postsSubs[Session.get('view')])
  //   var posts = Posts.find(this.find, this.options);
  //   return posts;
  // },
  // postsReady: function() {
  //   return postsSubs[Session.get('view')].ready();
  // },
  allPostsLoaded: function(){
    return false;
    // allPostsLoaded = postsSubs[Session.get('view')].fetch().length < postsSubs[Session.get('view')].loaded();
    // Session.set('allPostsLoaded', allPostsLoaded);
    // return allPostsLoaded;  
  },
  loadMoreUrl: function () {
    var count = parseInt(Session.get('postsLimit')) + parseInt(getSetting('postsPerPage', 10));
    return '/' + Session.get('view') + '/' + count;
  }
});

Template.posts_best.rendered = function(){
  var distanceFromTop = 0;
  $('.post').each(function(){
    distanceFromTop += $(this).height();
  });
  Session.set('distanceFromTop', distanceFromTop);
  $('body').css('min-height',distanceFromTop+160);
}

// Template.posts_best.events({
//   'click .more-link': function(e) {
//     e.preventDefault();
//     console.log('aaa')
//     Session.set('currentScroll',$('body').scrollTop());
//     // postsSubs[Session.get('view')].loadNextPage();
//     Session.set('postsLimit', 20);
//   }
// });

