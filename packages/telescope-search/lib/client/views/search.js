// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

Meteor.startup(function () {
  Template[getTemplate('search')].helpers({
    canSearch: function () {
      return canView(Meteor.user());
    },
    searchQuery: function () {
      return Session.get("searchQuery");
    },
    searchQueryEmpty: function () {
      return !!Session.get("searchQuery") ? '' : 'empty';
    }
  });

  Template[getTemplate('search')].events({
    'keyup, search .search-field': function(e){
      e.preventDefault();
      var val = $(e.target).val(),
          $search = $('.search'); 
      if(val==''){
        // if search field is empty, just do nothing and show an empty template 
        $search.addClass('empty');
        Session.set('searchQuery', '');
        Router.go('/search', null, {replaceState: true});
      }else{
        // if search field is not empty, add a delay to avoid firing new searches for every keystroke 
        delay(function(){
          Session.set('searchQuery', val);
          $search.removeClass('empty');

          // Update the querystring.
          var opts = {query: 'q=' + encodeURIComponent(val)};
          // if we're already on the search page, do a replaceState. Otherwise,
          // just use the pushState default.
          if(getCurrentRoute().indexOf('/search') === 0) {
            opts.replaceState = true;
          }
          Router.go('search', null, opts);

        }, 700 );
      }
    }
  });
});
