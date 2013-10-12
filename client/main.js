// Session variables
Session.set('initialLoad', true);
Session.set('categorySlug', null);
Session.set('today', new Date());
Session.set('view', 'top');

// Subscriptions

// note: here we only subscribe to subscriptions that we need to be available all the time.
// For subscriptions depending on specific pages, see the router. 

// TODO: add session variable that tracks once all subscriptions here have loaded

// Settings
Meteor.subscribe('settings', function(){
  // runs once after settings have loaded
  analyticsInit();
  Session.set('settingsLoaded',true);
});

// Categories
Meteor.subscribe('categories');

// Current User
// we need to subscribe to the currentUser subscription because by default, 
//Meteor doesn't send all the user properties that we need
Meteor.subscribe('currentUser');

// Notifications - only load if user is logged in
if(Meteor.userId() != null){
  Meteor.subscribe('notifications');
}