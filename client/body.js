Template.body.helpers({
  pageName : function(){
    return Meteor.Router.page();
  },
  backgroundColor: function(){
  	return getSetting('backgroundColor');
  },
  secondaryColor: function(){
  	return getSetting('secondaryColor');
  },
  buttonColor: function(){
  	return getSetting('buttonColor');
  },
  headerColor: function(){
  	return getSetting('headerColor');
  },      
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
