Meteor.startup(function () {
  Template[getTemplate('rssUrlItem')].events({
    'click .delete-url': function(e, instance){
      e.preventDefault();

      if (confirm(i18n.t('are_you_sure')))
        RssUrls.remove(instance.data._id);
    }
  });
});
