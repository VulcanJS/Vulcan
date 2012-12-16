Template.footer.helpers({
  footerCode: function(){
    return getSetting('footerCode');
  },
  distanceFromTop: function(){
    console.log('distanceFromTop', Session.get('distanceFromTop'))
    return parseInt(Session.get('distanceFromTop'))+70+20+70;
  },
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  }
});