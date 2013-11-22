Template.logs.helpers({
  getTimestamp: function () {
    return moment(this.timestamp).format("M/D, hh:mm:ss");
  },
  loadMoreUrl: function(){
    var count = parseInt(Session.get('logsLimit')) + 100;
    return '/logs/' + count;
  },  
});