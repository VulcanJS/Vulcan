import { registerComponent} from 'meteor/vulcan:core';
import React from 'react';
import moment from 'moment';

const LastVisitDisplay = (props, context) => {
  const lastEvent = props.lastEvent;
  // console.log("lastVisitDisplay props: ", props);
  if (!lastEvent || !lastEvent.properties) {
    return (
      <div className="last-visit-display">
        You have not visited this page before
      </div>
    )
  } else {
    return (
      <div className="last-visit-display">
        You last visited this page {moment(lastEvent.properties.startTime).fromNow()} for  {moment.duration(lastEvent.properties.duration).humanize()}
      </div>
    )
  }
}

LastVisitDisplay.displayName = 'LastVisitDisplay';

registerComponent('LastVisitDisplay', LastVisitDisplay);
