Template.posts_top.posts = function() { return topPosts(); };

Template.posts_top.helpers({
  moreLinkDistance: function(){
    return topPosts().length * 80;
  },
  allPostsLoaded: function(){
    return topPosts().length < Session.get('topPageLimit');
  }
});

Template.posts_top.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('topPageLimit', Session.get('topPageLimit') + TOP_PAGE_PER_PAGE)
  }
});

