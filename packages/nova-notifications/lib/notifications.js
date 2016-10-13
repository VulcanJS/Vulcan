import Users from 'meteor/nova:users';
import NovaEmail from 'meteor/nova:email';
// import Notifications from "./collection.js";

Telescope.notifications = {};

Telescope.notifications.create = (userIds, notificationName, data) => {
  
  console.log([userIds, notificationName], data)
  // notificationData = {
  //           comment: _.pick(comment, '_id', 'userId', 'author', 'htmlBody', 'postId'),
  //           post: _.pick(post, '_id', 'userId', 'title', 'url')
  //         };
  let noteData = {};
  // console.log(data)
  
  // Notifications.insert(noteData);
  // if userIds is not an array, wrap it in one
  if (!Array.isArray(userIds)) userIds = [userIds];

  userIds.forEach(userId => {

    const user = Users.findOne(userId);
    const email = NovaEmail.emails[notificationName];
    const properties = email.getProperties(data);
    const subject = email.subject(properties);
    const html = NovaEmail.getTemplate(email.template)(properties);
    
    const userEmail = Users.getEmail(user);
    
    if(notificationName == "newComment"){
      noteData = {
                      name: subject,
                      link: properties.postUrl
      }
      
      Users.update({_id: userId}, { $addToSet: {"telescope.notifications": noteData} });  
    }
    
    // $addToSet: {notifications: user._id},
    
    if (!!userEmail) {
      NovaEmail.buildAndSendHTML(Users.getEmail(user), subject, html);
    } else {
      console.log(`// Couldn't send notification: admin user ${user._id} doesn't have an email`);
    }
  });

};

if (typeof Telescope.settings.collection !== "undefined") {
  Telescope.settings.collection.addField({
    fieldName: 'emailNotifications',
    fieldSchema: {
      type: Boolean,
      optional: true,
      defaultValue: true,
      autoform: {
        group: 'notifications',
        instructions: 'Enable email notifications for new posts and new comments (requires restart).'
      }
    }
  });
}

