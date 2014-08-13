Meteor.startup(function () {
  Template[getTemplate('searchLogs')].helpers({
    getTime: function () {
      return moment(this.timestamp).format("HH:mm:ss");
    },
    getDate: function () {
      currentDate = moment(this.timestamp).format("MMMM DD");
      return currentDate;
    },
    searchCount: function () {
      // TODO: doesn't work properly with "load more"
      var after = moment(this.timestamp).startOf('day').valueOf(),
          before = moment(this.timestamp).endOf('day').valueOf();

      return Searches.find({
        timestamp: {
          $gte: after, 
          $lt: before
        }
      }).count();
    },
    isNewDate: function () {
      return (typeof currentDate === 'undefined') ? true : (currentDate !== moment(this.timestamp).format("MMMM DD"));
    },
    loadMoreUrl: function(){
      var count = parseInt(Session.get('logsLimit')) + 100;
      return '/logs/' + count;
    },  
  });
});