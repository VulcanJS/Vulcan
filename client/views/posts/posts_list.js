Template.posts_list.helpers({
  posts : function () {
    // this.postsList.rewind();    
    // var posts = this.postsList.map(function (post, index, cursor) {
    //   post.rank = index;
    //   return post;
    // });
    // return posts;
    return this.postsList;
  },
  allPostsLoaded: function(){
    return false;
    // TODO: find out when all posts have been loaded
    
    // allPostsLoaded = postsSubs[Session.get('view')].fetch().length < postsSubs[Session.get('view')].loaded();
    // Session.set('allPostsLoaded', allPostsLoaded);
    // return allPostsLoaded;  
  },
  loadMoreUrl: function () {
    var count = parseInt(Session.get('postsLimit')) + parseInt(getSetting('postsPerPage', 10));
    var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';
    return '/' + Session.get('view') + '/' + categorySegment + count;
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

