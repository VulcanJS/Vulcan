var getDateURL = function (moment) {
  return Router.path('postsSingleDay', {
    year: moment.year(),
    month: moment.month() + 1,
    day: moment.date()
  });
};


Template.single_day_nav.onCreated(function(){

  $(document).unbind('keyup'); //remove any potential existing bindings to avoid duplicates

  var currentDate = moment(this.data.terms.date).startOf('day');
  var today = moment(new Date()).startOf('day');

  $(document).bind('keyup', 'left', function(){
    Router.go($('.prev-link').attr('href'));
  });

  $(document).bind('keyup', 'right', function(){
    if(Users.is.admin(Meteor.user()) || today.diff(currentDate, 'days') > 0)
      Router.go($('.next-link').attr('href'));
  });

});

Template.single_day_nav.helpers({
  currentDate: function(){
    var currentDate = moment(this.terms.date);
    var today = moment(new Date());
    var diff = today.diff(currentDate, 'days');
    if (diff === 0) {
      return i18n.t("today");
    }
    if (diff === 1) {
      return i18n.t("yesterday");
    }
    return currentDate.format("dddd, MMMM Do YYYY");
  },
  previousDateURL: function(){
    var currentDate = moment(this.terms.date);
    var newDate = currentDate.subtract(1, 'days');
    return getDateURL(newDate);
  },
  showPreviousDate: function(){
    // TODO
    return true;
  },
  nextDateURL: function(){
    var currentDate = moment(this.terms.date);
    var newDate = currentDate.add(1, 'days');
    return getDateURL(newDate);
  },
  showNextDate: function(){
    var currentDate = moment(this.terms.date).startOf('day');
    var today = moment(new Date()).startOf('day');
    return Users.is.admin(Meteor.user()) || (today.diff(currentDate, 'days') > 0);
  }
});
