Template.search.helpers({
  searchQuery: function () {
    return Session.get("searchQuery");
  },
  searchQueryEmpty: function () {
    return !!Session.get("searchQuery") ? '' : 'empty';
  }
});

Template.search.events({
  'keyup, search .search-field': function(e){
    e.preventDefault();
    var val = $(e.target).val(),
        $search = $('.search'); 
    if(val==''){
      // if search field is empty, just do nothing and show an empty template 
      $search.addClass('empty');
      Session.set('searchQuery', '');
    }else{
      // if search field is not empty, add a delay to avoid firing new searches for every keystroke 
      delay(function(){
        Session.set('searchQuery', val);
        $search.removeClass('empty');
        // if we're not already on the search page, go to it
        if(getCurrentRoute().indexOf('search') == -1)
          Router.go('/search');
      }, 700 );
    }
  }
});

// see: http://stackoverflow.com/questions/1909441/jquery-keyup-delay
var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();