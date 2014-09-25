#Notifications
A notifications pattern strait out of Telescope! (actually still in Telescope >_>) 
---

###Current Status:
Feedback wanted! Help Appreciated. README improvements necessary, you are going to want to look at the code. I will clean this mess up soon.

#####some example features: existing, needed or as possible extension packages:
* The notifications should be have in app alerts (see telescope)
* The notifications should be aware the users online state and trigger higher levels of notification appropriately 
  * It could be aware of user idle state, via user-status, and if idle for x time trigger higher levels of notification
  * An example higher levels of notification would email
  * higher levels of notification could also be instant or use a timer as needed
* Emails could be as one off or a notifications summery.
* I would love some kind of push notification for mobile, OS X, and any Push compatible friends
  * If all else fails send emails.
* All the above should be customizable on a per user basis. So a user could set summary emails only at 7:00 user local time.
* RSS, IRC (maybe ?), I could go on...

---
###Current Features

* `Notifications` is your notification Meteor Collection
  * Thinking about moving this to Notifications.collection
  * This does a transform to add notification instance helpers

* a given notification instance [notification]
  * notification.userId //the user associated with this notification
  * notification.event //the notification event type (explained later)
  * notification.read //if the notification has been read 
  * notification.createdAt //when the notification was created
  * notification.message() //outputs some string
  * notification.url //the associated url, if any, used by routeSeenByUser (explained later)
  * notification.metadata //anything you need, useful in combo with notification.message()

* Client permissions (add deny to be more restrictive)
```js
Notifications.allow({
  insert: function(userId, doc){
    // new notifications can only be created via a Meteor method
    return false;
  },
  update: function (userId, doc) {
    return userId == doc.userId
  },
  remove: function (userId, doc) {
    return userId == doc.userId
  }
});
```

## Pushing so I can use Github's markdown editor. It's just the easiest to use.
