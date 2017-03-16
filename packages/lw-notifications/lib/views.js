import Notifications from './collection.js';

// will be common to all other view unless specific properties are overwritten
Notifications.addDefaultView(function (terms) {
  return {
    options: {limit: 1000}
  };
});

Notifications.addView("userNotifications", function (terms) {
  return {
    selector: {userId: terms.userId},
    options: {sort: {createdAt: -1}}
  };
});
