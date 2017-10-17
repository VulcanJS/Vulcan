import { Components, replaceComponent, getSetting, withCurrentUser, Head } from 'meteor/vulcan:core';
import React from 'react';
import Intercom from 'react-intercom';

const IntercomWrapper = ({ currentUser }) => {
  const appId = getSetting('intercom.appId');

  if (!appId) {
    console.warn('Please add intercom.appId to your public settings or disable the vulcan:intercom package.');
    return null;
  }

  return currentUser ? <Intercom 
    appID={appId} 
    email={currentUser.email}
    name={currentUser.displayName}
    _id={currentUser._id}
    profileUrl={currentUser.pageUrl}
  /> : null;

}

Head.components.push([IntercomWrapper, withCurrentUser]);
