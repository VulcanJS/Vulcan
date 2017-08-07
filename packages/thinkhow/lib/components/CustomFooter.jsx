import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';

const Footer = props => {
  return (
    <div className="footer">
    <a href="https://twitter.com/jhoff">Made by @jhoff</a>
    </div>
  )
}

Footer.displayName = "Footer";

registerComponent('Footer', Footer);
