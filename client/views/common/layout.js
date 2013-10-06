Template.layout.helpers({
  pageName : function(){
    if(Router._current){
      var currentPath = Router._current.path;
      var currentRoute = _.findWhere(Router.routes, {originalPath: currentPath});
      return currentRoute.name;
    }
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
  extraCode: function(){
    return getSetting('extraCode');
  }     
});

Template.layout.created = function(){
  Session.set('currentScroll', null);
}

Template.layout.rendered = function(){
    if(currentScroll=Session.get('currentScroll')){
      $('body').scrollTop(currentScroll);
      Session.set('currentScroll', null);
    }   
}
