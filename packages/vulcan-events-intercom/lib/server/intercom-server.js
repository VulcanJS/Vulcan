import Intercom from 'intercom-client';
import { getSetting, addCallback, Utils } from 'meteor/vulcan:core';
import { addPageFunction, addUserFunction, addInitFunction, addIdentifyFunction, addTrackFunction } from 'meteor/vulcan:events';

const token = getSetting('intercom.accessToken');

if (!token) {
  throw new Error('Please add your Intercom access token in settings.json');
} else {

  const intercomClient = new Intercom.Client({ token });

  const getDate = () => new Date().valueOf().toString().substr(0,10);

  /*

  New User

  */
  function intercomNewUser(user) {
    intercomClient.users.create({
      email: user.email,
      custom_attributes: {
        name: user.displayName,
        profileUrl: Users.getProfileUrl(user, true),
        _id: user._id,
      }
    });
  }
  addUserFunction(intercomNewUser);

  /*

  Track Event

  */
  function intercomTrackServer(eventName, eventProperties, currentUser) {
    intercomClient.events.create({
      event_name: eventName,
      created_at: getDate(),
      email: currentUser.email,
      metadata: {
        ...eventProperties
      }
    });
  }
  addTrackFunction(intercomTrackServer);
  
}
