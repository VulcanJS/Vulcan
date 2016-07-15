import React from 'react';
import { FormattedMessage } from 'react-intl';

const Footer = props => {
  return (
    <div className="footer"><a href="http://telescopeapp.org" target="_blank"><FormattedMessage id="app.powered_by"/></a></div>
  )
}

Footer.displayName = "Footer";

module.exports = Footer;