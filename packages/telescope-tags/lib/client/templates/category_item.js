Template.category_title.helpers({
  title: function () {
    var category = Categories.findOne({slug: this.terms.category});

    if( !!Session.get("searchByCat") )
      return i18n.t('search')+' '+Categories.findOne({slug: Session.get("searchByCat")}).name;
    else if( typeof category !== 'undefined')
      return category.name;
    else
      return '';
  },
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

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();

Template.category_title.events({
  'keyup .catSearchField': function(e){
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

      delay(function(){
        Session.set('searchQuery', val);
        // Update the querystring.
        var opts = {query: {q: val}};
        //if category set add to the query
        if( !!Session.get("searchByCat") )
          opts.query.cat = Session.get("searchByCat");
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
