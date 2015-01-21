Template[getTemplate('postsListIncoming')].events({
  'click .show-new': function(e, instance) {
    Session.set('listPopulatedAt', new Date());
  }
});