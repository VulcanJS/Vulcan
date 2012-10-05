Template.error.message= function(){
	var outerContext = Meteor.deps.Context.current;
    var innerContext = new Meteor.deps.Context;
    var error;
    
    innerContext.onInvalidate(function() {
      // we don't need to send the invalidate through anymore if post is set
      error || outerContext.invalidate();
    });
    
    innerContext.run(function() {
      error = Session.get("error");
    });
    
    return error;
}

Template.error.rendered = function(){
	Meteor.setTimeout(function(){
		Session.set("error", null);
	}, 100);
}