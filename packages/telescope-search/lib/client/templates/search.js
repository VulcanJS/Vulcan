// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

Meteor.startup(function () {

  Template.search.helpers({
    canSearch: function () {
      return Users.can.view(Meteor.user());
    },
    searchQuery: function () {
      return Session.get("searchQuery");
    },
    searchQueryEmpty: function () {
      return !!Session.get("searchQuery") ? '' : 'empty';
    }
  });

  Template.search.events({
    'keyup .search-field, search .search-field': function(e){
      e.preventDefault();
      var val = $(e.target).val(),
          $search = $('.search');
      if (val === '') {
        // if search field is empty, just do nothing and show an empty template
        $search.addClass('empty');
        Session.set('searchQuery', '');
        Router.go('search', null, {replaceState: true});
      } else {
        $search.removeClass('empty');
                // if last page was category add it to session
        var a=window.location.href;a=a.split('/');
        if( !Session.get("searchByCat") && a.indexOf('category') >= 0 ){
          a=a[a.indexOf('category')+1];
          Session.set("searchByCat",a);
          console.log('Search set for Category : '+a);
        }
        else if( !!Session.get("searchByCat") )//if it is already set show it
          console.log('Searching in Category : '+Session.get("searchByCat"));

        
        // if search field is not empty, add a delay to avoid firing new searches for every keystroke
        delay(function(){
          Session.set('searchQuery', val);

          // Update the querystring.
          var opts = {query: {q: val}};
          // if we're already on the search page, do a replaceState. Otherwise,
          // just use the pushState default.
          if(Router.current().route.getName() === 'search') {
            opts.replaceState = true;
          }
          Router.go('search', null, opts);

        }, 700 );
      }
    }
  });

});
