Template.users.helpers({
  loadMoreUrl: function(){
    var count = parseInt(Session.get('usersLimit')) + 20;
    return '/all-users/' + count;
  },
  allPostsLoaded: function () {
    return false;
    //TODO: hide load more button when all users have been loaded
  }
});