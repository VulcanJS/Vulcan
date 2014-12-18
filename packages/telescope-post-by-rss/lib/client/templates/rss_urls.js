Meteor.startup(function () {
  Template[getTemplate('rssUrls')].helpers({
    rssUrls: function(){
      return RssUrls.find({}, {sort: {url: 1}});
    },
    rssUrlItem: function () {
      return getTemplate('rssUrlItem');
    }
  });

  Template[getTemplate('rssUrls')].events({
    'click input[type=submit]': function(e){
      e.preventDefault();

      var url = $('#url').val();
      
      Meteor.call('insertRssUrl', {url: url}, function(error, result) {
        if(error){
          console.log(error);
          flashMessage(error.reason, "error");
          clearSeenMessages();
        }else{
          $('#url').val('');
        }
      });
    }
  });
});
