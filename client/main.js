// Session variables
Session.set('initialLoad', true);
Session.set('today', new Date());
Session.set('view', 'top');
Session.set('postsLimit', getSetting('postsPerPage', 2));
Session.set('settingsLoaded', false);
Session.set('sessionId', Meteor.default_connection._lastSessionId);

// Subscriptions

// note: here we only subscribe to subscriptions that we need to be available all the time.
// For subscriptions depending on specific pages, see the router. 

// TODO: add session variable that tracks when all global subscriptions have loaded

// Settings
Meteor.subscribe('settings', function(){
  // runs once after settings have loaded
  Session.set('settingsLoaded',true);
  analyticsInit();
});

// Categories
Meteor.subscribe('categories');

// Current User
// We need to subscribe to the currentUser subscription because by itself, 
// Meteor doesn't send all the user properties that we need
Meteor.subscribe('currentUser');

// Subscribe to all users for now to make user selection autocomplete work?
// Meteor.subscribe('allUsers', {}, {});

// Notifications - only load if user is logged in
if(Meteor.user() != null)
  Meteor.subscribe('notifications');

STATUS_PENDING=1;
STATUS_APPROVED=2;
STATUS_REJECTED=3;

