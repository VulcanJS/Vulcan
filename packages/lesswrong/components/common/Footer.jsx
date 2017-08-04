import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const Footer = props => {
  return (
    <div className="footer"><a href="/about">Made with heart and brain for humanity</a></div>
  )
}

Footer.displayName = "Footer";

registerComponent('Footer', Footer);
