import Users from '../modules.js';

/**
 * @summary Publish a single user
 * @param {String} idOrSlug
 */
Meteor.publish('users.single', function (terms) {

  var idOrSlug = terms._id || terms['telescope.slug'];
  var findById = Meteor.users.findOne(idOrSlug);
  var findBySlug = Meteor.users.findOne({"telescope.slug": idOrSlug});
  var user = typeof findById !== 'undefined' ? findById : findBySlug;
  var options = Users.is.admin(this.userId) ? {} : {fields: Users.publishedFields.public};
  return user ? Meteor.users.find({_id: user._id}, options) : [];

});

/**
 * @summary Publish the current user
 */
Meteor.publish('users.current', function () {
  const user = Meteor.users.find({_id: this.userId}, {fields: {'services.password.bcrypt': false}});
  return user || [];
});

// // publish all users for admins to make autocomplete work
// // TODO: find a better way

// Meteor.publish('allUsersAdmin', function() {

//   

//   var selector = Settings.get('requirePostInvite') ? {isInvited: true} : {}; // only users that can post
//   if (Users.is.adminById(this.userId)) {
//     return Meteor.users.find(selector, {fields: Users.pubsub.avatarProperties});
//   }
//   return [];
// });

// // Publish all users to reactive-table (if admin)
// // Limit, filter, and sort handled by reactive-table.
// // https://github.com/aslagle/reactive-table#server-side-pagination-and-filtering-beta

// ReactiveTable.publish("all-users", function() {

//   
  
//   if(Users.is.adminById(this.userId)){
//     return Meteor.users;
//   } else {
//     return [];
//   }
// });
