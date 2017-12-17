import Analytics from 'analytics-node';
import { getSetting } from 'meteor/vulcan:core';
const analytics = new Analytics(getSetting('segment.serverKey'));

export default analytics;