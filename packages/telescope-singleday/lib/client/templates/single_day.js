Template.single_day.helpers({
  showDateNav: function () {
    return (typeof this.showDateNav === 'undefined') ? true : this.showDateNav;
  }
});