Template.singleDay.helpers({
  showDateNav: function () {
    return (typeof this.showDateNav === 'undefined') ? true : this.showDateNav;
  },
  context: function () {
    // if instance has a set date use this, else depend on Session variable
    var currentDate = (!!this.date) ? this.date: Session.get('currentDate');
    return {
      terms: {
        view: 'singleday',
        after: moment(currentDate).startOf('day').toDate(),
        before: moment(currentDate).endOf('day').toDate()
      }
    };
  }
});