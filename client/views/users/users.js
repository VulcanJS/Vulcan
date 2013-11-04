Template.users.helpers({
  loadMoreUrl: function(){
    var count = parseInt(Session.get('usersLimit')) + 20;
    return '/all-users/' + count + '?filter='+this.filter;
  },
  allPostsLoaded: function () {
    console.log(this)
    return false;
    //TODO: hide load more button when all users have been loaded
  },
  activeClass: function (link) {
    console.log(this.filter)
    if(link == this.filter)
      return "active";
  }
});