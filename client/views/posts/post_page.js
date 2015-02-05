Template[getTemplate('post_page')].helpers({
  post_item: function () {
    return getTemplate('post_item');
  },
  post_body: function () {
    return getTemplate('post_body');
  },
  comment_form: function () {
    return getTemplate('comment_form');
  },
  comment_list: function () {
    return getTemplate('comment_list');
  },
  poll_form: function () {
    return getTemplate('poll_form');
  },
  displayInfoPoll: function () {
    var displayQuery = window.location.search;
    if(displayQuery && displayQuery.indexOf('comment-only')>-1) {
      return false;
    }
    return true;
  }

});

Template[getTemplate('post_page')].rendered = function(){
  $('body').scrollTop(0);
};
