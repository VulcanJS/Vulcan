Template[getTemplate('users')].helpers({
  user_item: function () {
    return getTemplate('user_item');
  },
  loadMoreUrl: function(){
    var count = parseInt(Session.get('usersLimit')) + 20;
    return '/all-users/' + count + '?filterBy='+this.filterBy+'&sortBy='+this.sortBy;
  },
  allPostsLoaded: function () {
    return false;
    //TODO: hide load more button when all users have been loaded
  },
  activeClass: function (link) {
    if(link == this.filterBy || link == this.sortBy)
      return "active";
  },
  sortBy: function (parameter) {
    return "?filterBy="+this.filterBy+"&sortBy="+parameter;
  },
  filterBy: function (parameter) {
    return "?filterBy="+parameter+"&sortBy="+this.sortBy;
  }
});