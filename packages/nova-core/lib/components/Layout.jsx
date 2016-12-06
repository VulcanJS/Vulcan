import { registerComponent } from 'meteor/nova:lib';
import React from 'react';

const Layout = props => {
  return (
    <div>{props.children}</div>
  );
}

Layout.displayName = "Layout";

registerComponent('Layout', Layout);

export default Layout;