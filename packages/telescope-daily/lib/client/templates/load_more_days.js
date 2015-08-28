Template.load_more_days.helpers({
  loadMoreDaysUrl: function () {
    var count = parseInt(this.daysCount) + daysPerPage;
    return '/daily/?days=' + count;
  }
});

Template.load_more_days.events({
  'click .load-more-days-button': function (e, instance) {
    e.preventDefault();
    instance.data.handler();
  }
});