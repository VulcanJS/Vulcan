import { registerSetting } from 'meteor/vulcan:core';

registerSetting('segment.clientKey', null, 'Segment client-side API key');
registerSetting('segment.serverKey', null, 'Segment server-side API key');
