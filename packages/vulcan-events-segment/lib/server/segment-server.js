import Analytics from 'analytics-node';
import { getSetting } from 'meteor/vulcan:core';
import { addIdentifyFunction, addTrackFunction } from 'meteor/vulcan:events';

const segmentWriteKey = getSetting('segment.serverKey');
let lastIdentifiedUser = null;

if (segmentWriteKey) {

  const analytics = new Analytics(segmentWriteKey);

  /*

  Identify User

  */
  // eslint-disable-next-line no-inner-declarations
  function segmentIdentifyServer(currentUser) {
    const identifiedUser = {
      userId: currentUser._id,
      traits: {
        email: currentUser.email,
        pageUrl: currentUser.pageUrl,
      },
    };
    
    if (!identifiedUser.traits.pageUrl) {
      return;
    }
    
    if (identifiedUser.userId === (lastIdentifiedUser && lastIdentifiedUser.userId) &&
      identifiedUser.traits.email === (lastIdentifiedUser && lastIdentifiedUser.traits.email) &&
      identifiedUser.traits.pageUrl === (lastIdentifiedUser && lastIdentifiedUser.traits.pageUrl)
    ) {
      return;
    }
    
    analytics.identify(identifiedUser);
    lastIdentifiedUser = identifiedUser;
  }
  addIdentifyFunction(segmentIdentifyServer);

  /*

  Track Event

  */
  // eslint-disable-next-line no-inner-declarations
  function segmentTrackServer(eventName, eventProperties, currentUser) {
    analytics.track({
      event: eventName,
      properties: eventProperties,
      userId: currentUser && currentUser._id,
    });
  }
  addTrackFunction(segmentTrackServer);
}
