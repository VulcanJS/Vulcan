import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';

const adminStyles = {
  padding: '20px'
}

const AdminLayout = props => <div className="admin-layout" style={adminStyles}>{props.children}</div>

registerComponent('AdminLayout', AdminLayout);