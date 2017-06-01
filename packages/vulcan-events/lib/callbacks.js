import { addCallback } from 'meteor/vulcan:core';
import { sendGoogleAnalyticsRequest } from './helpers';

// add client-side callback: log a ga request on page view
addCallback('router.onUpdate', sendGoogleAnalyticsRequest);