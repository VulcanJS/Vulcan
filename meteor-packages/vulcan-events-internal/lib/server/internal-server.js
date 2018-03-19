import { addTrackFunction } from 'meteor/vulcan:events';
import { newMutation } from 'meteor/vulcan:lib';
import Events from '../modules/collection';

async function trackInternalServer(eventName, eventProperties, currentUser) {
  const document = {
    name: eventName,
    properties: eventProperties,
  };
  return await newMutation({
    collection: Events,
    document,
    currentUser,
    validate: false,
    context: {},
  });
}

addTrackFunction(trackInternalServer);
