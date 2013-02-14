Template.body.helpers({
  pageName : function(){
    return Meteor.Router.page();
  },
  backgroundColor: function(){
  	return getSetting('backgroundColor', '#e0f1f7');
  },
  secondaryColor: function(){
  	return getSetting('secondaryColor', '#7ac0e4');
  },
  buttonColor: function(){
  	return getSetting('buttonColor', '#f36c3d');
  },
  headerColor: function(){
  	return getSetting('headerColor', '#4e555d');
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