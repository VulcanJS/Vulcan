Template.footer.helpers({
  footerCode: function(){
    return getSetting('footerCode');
  },
  extraCode: function(){
    return getSetting('extraCode');
  },  
  distanceFromTop: function(){
    var distanceFromTop = parseInt(Session.get('distanceFromTop'))+70+20;
    if(Meteor.Router.page()!='posts_digest' && !Session.get('allPostsLoaded'))
      distanceFromTop += 70;
    return distanceFromTop;
  },
  footerClass: function(){
    return Session.get('isPostsList') ? 'absolute' : 'static';
  }
});