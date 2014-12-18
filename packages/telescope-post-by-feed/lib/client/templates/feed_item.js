Meteor.startup(function () {
  Template[getTemplate('feedItem')].events({
    'click .delete-feed': function(e, instance){
      e.preventDefault();

      if (confirm(i18n.t('are_you_sure')))
        Feeds.remove(instance.data._id);
    }
  });
});
