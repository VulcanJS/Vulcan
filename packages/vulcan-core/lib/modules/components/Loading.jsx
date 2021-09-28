import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const Loading = props => {
  return (
    <div className={`spinner ${props.className}`}>
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
};

Loading.displayName = 'Loading';

registerComponent('Loading', Loading);

export default Loading;
