Template.footer.helpers({
  footerCode: function(){
    return getSetting('footerCode');
  },
  distanceFromTop: function(){
    console.log('distanceFromTop', Session.get('distanceFromTop'))
    return parseInt(Session.get('distanceFromTop'))+70+20+70;
  }
});

Template.footer.rendered = function(){
    if(_.contains(['posts_top', 'posts_new', 'posts_digest', 'posts_pending'], Meteor.Router.page())){
      $('.footer').addClass('absolute');
    } 
}