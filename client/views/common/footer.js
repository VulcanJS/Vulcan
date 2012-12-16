Template.footer.helpers({
  footerCode: function(){
    return getSetting('footerCode');
  },
  extraCode: function(){
    return getSetting('extraCode');
  },  
  distanceFromTop: function(){
    return parseInt(Session.get('distanceFromTop'))+70+20+70;
  },
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  }
});