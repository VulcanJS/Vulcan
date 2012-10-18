Template.posts_new.posts = function(){
  return newPosts();
};

Template.posts_new.helpers({
  moreLinkDistance: function(){
    return newPosts().length * 80;
  },
  allPostsLoaded: function(){
    return newPosts().length < Session.get('newPageLimit');
  }
});

Template.posts_new.events({
  'click .more-link': function(e) {
    e.preventDefault();
    Session.set('newPageLimit', Session.get('newPageLimit') + NEW_PAGE_PER_PAGE)
  }
});
