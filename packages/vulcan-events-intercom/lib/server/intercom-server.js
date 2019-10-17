import Intercom from 'intercom-client';
import { Connectors, getSetting /* addCallback, Utils */ } from 'meteor/vulcan:core';
import {
  // addPageFunction,
  addUserFunction,
  // addInitFunction,
  // addIdentifyFunction,
  addTrackFunction,
} from 'meteor/vulcan:events';
import Users from 'meteor/vulcan:users';

const token = getSetting('intercom.accessToken');

if (!token) {
  throw new Error('Please add your Intercom access token as intercom.accessToken in settings.json');
} else {
  export const intercomClient = new Intercom.Client({ token });

  const getDate = () =>
    new Date()
      .valueOf()
      .toString()
      .substr(0, 10);

  /*

  New User

  */
  // eslint-disable-next-line no-inner-declarations
  async function intercomNewUser({ user }) {
    await intercomClient.users.create({
      email: user.email,
      user_id: user._id,
      custom_attributes: {
        name: user.displayName,
        profileUrl: Users.getProfileUrl(user, true),
      },
    });
  }
  addUserFunction(intercomNewUser);

  /*

  Track Event

  */
  // eslint-disable-next-line no-inner-declarations
  function intercomTrackServer(eventName, eventProperties, currentUser = {}) {
    intercomClient.events.create({
      event_name: eventName,
      created_at: getDate(),
      email: currentUser.email,
      user_id: currentUser._id,
      metadata: {
        ...eventProperties,
      },
    });
  }
  addTrackFunction(intercomTrackServer);
}
