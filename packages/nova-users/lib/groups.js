import Users from './collection.js';

/**
 * @summary Group class
 */
class Group {
  
  constructor() {
    this.actions = [];
  }

  can(actions) {
    actions = Array.isArray(actions) ? actions : actions;
    this.actions = this.actions.concat(actions);
  }

  cannot(actions) {
    actions = Array.isArray(actions) ? actions : actions;
    this.actions = _.difference(this.actions, actions);
  }

}

/**
 * @summary Users.groups object
 */
Users.groups = {};

/**
 * @summary create a new group
 * @param {String} groupName
 */
Users.createGroup = groupName => {
  Users.groups[groupName] = new Group();
};

/**
 * @summary get a list of a user's groups
 * @param {Object} user
 */
Users.getGroups = user => {

  let userGroups = [];

  if (!user) { // anonymous user

    userGroups = ["anonymous"];
  
  } else {
  
    userGroups = ["default"];

    if (user.telescope.groups) { // custom groups
      userGroups = userGroups.concat(user.telescope.groups);
    } 
    
    if (Users.is.admin(user)) { // admin
      userGroups.push("admins");
    }

  }

  return userGroups;

};
Users.helpers({getGroups: function () {return Users.getGroups(this);}});

/**
 * @summary get a list of all the actions a user can perform
 * @param {Object} user
 */
Users.getActions = user => {
  const userGroups = Users.getGroups(user);
  const groupActions = userGroups.map(groupName => Users.groups[groupName].actions);
  return _.unique(_.flatten(groupActions));
};
Users.helpers({getActions: function () {return Users.getActions(this);}});

/**
 * @summary check if a user can perform a specific action
 * @param {Object} user
 * @param {String} action
 */
Users.canDo = (user, action) => {
  return Users.getActions(user).indexOf(action) !== -1;
};
Users.helpers({canDo: function (action) {return Users.canDo(this, action);}});

/**
 * @summary initialize the 3 out-of-the-box groups
 */
Users.createGroup("anonymous"); // non-logged-in users
Users.createGroup("default"); // regular users
Users.createGroup("admins"); // admin users

/**
 * @summary add default actions concerning users
 */
const defaultActions = [
  "users.edit.own", 
  "users.remove.own"
];
Users.groups.default.can(defaultActions);

const adminActions = [
  "users.edit.all",
  "users.remove.all"
];
Users.groups.admins.can(adminActions);

console.log(Users.groups);
