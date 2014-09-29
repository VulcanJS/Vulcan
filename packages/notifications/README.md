#Notifications

A notifications pattern strait out of Telescope! (actually still in Telescope >_>) Worth notting that everything in here is open to change. Any refrences to telescope may or may not have been aproved.

##Current Status:
Feedback wanted! Help Appreciated. README improvements necessary, you are going to want to look at the code. I will clean this mess up soon.

#### some example features 
*existing, needed or as possible extension packages*

- The notifications should be have in app alerts (see telescope)
- The notifications should be aware the users online state and trigger higher levels of notification appropriately 
  - It could be aware of user idle state, via user-status, and if idle for x time trigger higher levels of notification
  - An example higher levels of notification would email
  - higher levels of notification could also be instant or use a timer as needed
- Emails could be as one off or a notifications summery.
- I would love some kind of push notification for mobile, OS X, and any Push compatible friends
  - If all else fails send emails.
- All the above should be customizable on a per user basis. So a user could set summary emails only at 7:00 user local time.
- RSS, IRC (maybe ?), I could go on...
## Usage

#### On Client and Sever
You will want to set up an event type. Your notification **must** have a type. The benefit to this is it lets you add metadata and a dynamic message to your notifications. This is using a collection transform in the background.

An example from Telescope
```js
Notifications.addEventType('newReply', {
  message: function () {
    return this.properties.comment.author + " has replied to your comment on \"" + this.properties.post.title + "\"";
  },
  metadata: {
    emailTemplate: 'emailNewReply',
    template: 'notificationNewReply'
  }
});

```

#### On the Server
You can create a new notification on the server with createNotification. 

This will likely be cleaned up but you most supply a userId, and event. Properties stores in collection metadata, may need to name that better.

An example also out of Telescope.
```js

params = {
    event: 'newReply',
    properties: {
      comment: //some comment data
      post: //some post data
      parentComment: //some parentComment data
    }
  };

Notifications.createNotification(userToNotifyId, params, function (error, notificationId) { 
    if (error) throw error; //output error like normal
    
    if(Meteor.isServer && getUserSetting('notifications.replies', false, userToNotify)){
      var notification = Notifications.collection.findOne(notificationId);
      // send email
    }
  })
```
#### On the Client

Currently I have not added any client code other then an auto subscribe if the user is logged in. I am not sure adding templates is even a good idea. I have seen too many packages that are practically unusable because the are locked into a single style. Like Meteor's core account-ui or anything that uses bootstrap only. 

For now just call `Notifications.collection.find()` on the client to get what you need.


##Current Features

#### Notifications.collection
`Notifications.collection` is your notification Meteor Collection.

##### A given notification instance
```js
notification = {
  userId //the user associated with this notification
  event //the notification event type (explained later)
  read //if the notification has been read 
  createdAt //when the notification was created
  message() //outputs some string
  url //the associated url, if any, used by routeSeenByUser (explained later)
  metadata //anything you need, useful in combo with notification.message()
}
```

#### Client permissions 
 You can add a `Notifications.collection.deny` if you would like to be more restrictive on client updates
 
 The built in permissions are:
```js
Notifications.collection.allow({
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
