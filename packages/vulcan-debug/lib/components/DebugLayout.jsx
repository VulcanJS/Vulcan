import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';

const debugStyles = {
  padding: '20px'
};

const DebugLayout = props => <div className="debug-layout" style={debugStyles}>{props.children}</div>;

registerComponent('DebugLayout', DebugLayout);
