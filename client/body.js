Template.body.helpers({
  pageName : function(){
    return Meteor.Router.page();
  }
});

Template.body.created = function(){
  Session.set('currentScroll', null);
}

Template.body.rendered = function(){
    if(currentScroll=Session.get('currentScroll')){
      $('body').scrollTop(currentScroll);
      Session.set('currentScroll', null);
    }   
}