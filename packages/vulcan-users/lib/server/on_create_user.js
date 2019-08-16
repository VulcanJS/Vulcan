import Users from '../modules/index.js';
import {
  runCallbacks,
  runCallbacksAsync,
  Utils,
  debug,
  debugGroup,
  debugGroupEnd,
} from 'meteor/vulcan:lib'; // import from vulcan:lib because vulcan:core isn't loaded yet
import clone from 'lodash/clone';

// TODO: the following should use async/await, but async/await doesn't seem to work with Accounts.onCreateUser
function onCreateUserCallback(options, user) {
  debug('');
  debugGroup('--------------- start \x1b[35m onCreateUser ---------------');
  debug(`Options: ${JSON.stringify(options)}`);
  debug(`User: ${JSON.stringify(user)}`);

  const schema = Users.simpleSchema()._schema;

  delete options.password; // we don't need to store the password digest
  delete options.username; // username is already in user object

  options = runCallbacks({ name: 'user.create.validate.before', iterator: options });
  // OpenCRUD backwards compatibility
  options = runCallbacks('users.new.validate.before', options);

  // validate options since they can't be trusted
  Users.simpleSchema().validate(options);

  // check that the current user has permission to insert each option field
  _.keys(options).forEach(fieldName => {
    var field = schema[fieldName];
    if (!field || !Users.canCreateField(user, field)) {
      throw new Error(
        Utils.encodeIntlError({ id: 'app.disallowed_property_detected', value: fieldName })
      );
    }
  });

  // extend user with options
  user = Object.assign(user, options);

  // run validation callbacks
  user = runCallbacks({ name: 'user.create.validate', iterator: user, properties: {} });
  // OpenCRUD backwards compatibility
  user = runCallbacks('users.new.validate', user);

  // run onCreate step
  for (let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onCreate) {
      const document = clone(user);
      // eslint-disable-next-line no-await-in-loop
      autoValue = schema[fieldName].onCreate({ document });
    } else if (schema[fieldName].onInsert) {
      // OpenCRUD backwards compatibility
      // eslint-disable-next-line no-await-in-loop
      autoValue = schema[fieldName].onInsert(clone(user));
    }
    if (typeof autoValue !== 'undefined') {
      user[fieldName] = autoValue;
    }
  }
  user = runCallbacks({ name: 'user.create.before', iterator: user, properties: {} });
  user = runCallbacks('users.new.sync', user);

  runCallbacksAsync({ name: 'user.create.async', properties: { data: user, document: user, user, collection: Users } });
  // OpenCRUD backwards compatibility
  runCallbacksAsync('users.new.async', user);

  // check if all required fields have been filled in. If so, run profile completion callbacks
  if (Users.hasCompletedProfile(user)) {
    runCallbacksAsync('user.profileCompleted.async', user);
    // OpenCRUD backwards compatibility
    runCallbacksAsync('users.profileCompleted.async', user);
  }

  debug(`Modified User: ${JSON.stringify(user)}`);
  debugGroupEnd();
  debug('--------------- end \x1b[35m onCreateUser ---------------');
  debug('');

  return user;
}

Meteor.startup(() => {
  if (typeof Accounts !== 'undefined') {
    Accounts.onCreateUser(onCreateUserCallback);
  }
});
