import Analytics from 'analytics-node';
import { getSetting, addCallback, Utils } from 'meteor/vulcan:core';
import { addPageFunction, addInitFunction, addIdentifyFunction, addTrackFunction } from 'meteor/vulcan:events';

const analytics = new Analytics(getSetting('segment.serverKey'));

/*

Identify User

*/
function segmentIdentifyServer(currentUser) {
  analytics.identify({
    userId: currentUser._id,
    traits: {
      email: currentUser.email,
      pageUrl: currentUser.pageUrl,
    },
  });
}
addIdentifyFunction(segmentIdentifyServer);

/*

Track Event

*/
function segmentTrackServer(eventName, eventProperties, currentUser) {
  analytics.track({
    event: eventName,
    properties: eventProperties,
    userId: currentUser && currentUser._id,
  });
}
addTrackFunction(segmentTrackServer);
