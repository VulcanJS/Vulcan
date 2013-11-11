Template.footer.helpers({
  footerCode: function(){
    return getSetting('footerCode');
  }, 
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  }
});