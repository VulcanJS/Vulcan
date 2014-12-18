Meteor.startup(function () {
  Template[getTemplate('feeds')].helpers({
    feeds: function(){
      return Feeds.find({}, {sort: {url: 1}});
    },
    feedItem: function () {
      return getTemplate('feedItem');
    }
  });

  Template[getTemplate('feeds')].events({
    'click input[type=submit]': function(e){
      e.preventDefault();

      var url = $('#url').val();
      
      Meteor.call('insertFeed', {url: url}, function(error, result) {
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
