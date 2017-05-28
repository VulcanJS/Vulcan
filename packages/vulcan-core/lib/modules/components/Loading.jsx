import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const Loading = props => {
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  )
}

Loading.displayName = "Loading";

registerComponent('Loading', Loading);

export default Loading;