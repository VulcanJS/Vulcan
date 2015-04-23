Template.footer.helpers({
  footerCode: function(){
    return Settings.get('footerCode');
  },
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  }
});
