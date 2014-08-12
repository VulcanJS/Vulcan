Template[getTemplate('footer')].helpers({
  footerCode: function(){
    return getSetting('footerCode');
  }, 
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  },
  footerModules: function () {
    return footerModules;
  },
  getTemplate: function () {
    return getTemplate(this.template);
  }
});