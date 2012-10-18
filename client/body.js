Template.body.events({
  'click a[href]': function(event) {
    var url = $(event.target).closest('a').attr('href').replace(/#.*$/, '');
    if (url && url[0] === '/' && url !== document.location.href) {
      event.preventDefault();
      Router.navigate(url, {trigger: true});
      $('body').removeClass('mobile-nav-open');
    }
  }
});

Template.body.created = function(){
	Session.set('currentScroll', null);
}

Template.body.rendered = function(){
    if(currentScroll=Session.get('currentScroll')){
      console.log(currentScroll);
      $('body').scrollTop(currentScroll);
    }  	
}