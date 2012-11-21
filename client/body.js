Template.body.created = function(){
	Session.set('currentScroll', null);
}

Template.body.rendered = function(){
    if(currentScroll=Session.get('currentScroll')){
      console.log(currentScroll);
      $('body').scrollTop(currentScroll);
      Session.set('currentScroll', null);
    }  	
}