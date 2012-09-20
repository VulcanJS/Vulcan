Template.body.events({
  'click a[href]': function(event) {
    var url = $(event.target).closest('a').attr('href').replace(/#.*$/, '');
    if (url && url[0] === '/' && url !== document.location.href) {
      event.preventDefault()
      Router.navigate(url, {trigger: true})
    }
  }
});