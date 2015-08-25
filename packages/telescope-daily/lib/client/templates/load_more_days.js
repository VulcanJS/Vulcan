Template.load_more_days.helpers({
  loadMoreDaysUrl: function () {
    var count = parseInt(this.daysCount) + daysPerPage;
    return '/daily/' + count;
  }
});