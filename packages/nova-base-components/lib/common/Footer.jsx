import { registerComponent } from 'meteor/nova:core';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = props => {
  return (
    <div className="footer"><a href="http://telescopeapp.org" target="_blank"><FormattedMessage id="app.powered_by"/></a></div>
  )
}

Footer.displayName = "Footer";

registerComponent('Footer', Footer);