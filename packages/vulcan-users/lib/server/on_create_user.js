import Users from '../modules/index.js';
import { runCallbacks, runCallbacksAsync, Utils, debug, debugGroup, debugGroupEnd } from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet

// TODO: the following should use async/await, but async/await doesn't seem to work with Accounts.onCreateUser
function onCreateUserCallback(options, user) {
  debug('');
  debugGroup(`--------------- start \x1b[35m onCreateUser ---------------`);
  debug(`Options: ${JSON.stringify(options)}`);
  debug(`User: ${JSON.stringify(user)}`);

  const schema = Users.simpleSchema()._schema;

  delete options.password; // we don't need to store the password digest
  delete options.username; // username is already in user object

  options = runCallbacks(`user.new.validate.before`, options);
  // OpenCRUD backwards compatibility
  options = runCallbacks(`users.new.validate.before`, options);

  // validate options since they can't be trusted
  Users.simpleSchema().validate(options);

  // check that the current user has permission to insert each option field
  _.keys(options).forEach(fieldName => {
    var field = schema[fieldName];
    if (!field || !Users.canCreateField(user, field)) {
      throw new Error(Utils.encodeIntlError({ id: 'app.disallowed_property_detected', value: fieldName }));
    }
  });

  // extend user with options
  user = Object.assign(user, options);

  // run validation callbacks
  user = runCallbacks(`user.new.validate`, user);
  // OpenCRUD backwards compatibility
  user = runCallbacks(`users.new.validate`, user);

  // run onInsert step
  // note: cannot use forEach with async/await.
  // note 2: don't use async/await here for now. TODO: fix this.
  // See https://stackoverflow.com/a/37576787/649299
  for (let fieldName of _.keys(schema)) {
    if (!user[fieldName] && schema[fieldName].onInsert) {
      const autoValue = schema[fieldName].onInsert(user, options);
      if (typeof autoValue !== 'undefined') {
        user[fieldName] = autoValue;
      }
    }
  }

  user = runCallbacks('users.new.sync', user);

  runCallbacksAsync("user.new.async", user);
  // OpenCRUD backwards compatibility
  runCallbacksAsync("users.new.async", user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    runCallbacksAsync("user.profileCompleted.async", user);
    // OpenCRUD backwards compatibility
    runCallbacksAsync("users.profileCompleted.async", user);
  }

  debug(`Modified User: ${JSON.stringify(user)}`);
  debugGroupEnd();
  debug(`--------------- end \x1b[35m onCreateUser ---------------`);
  debug('');

  return user;
}

Meteor.startup(() => {
  if (typeof Accounts !== 'undefined') {
    Accounts.onCreateUser(onCreateUserCallback);
  }
});
