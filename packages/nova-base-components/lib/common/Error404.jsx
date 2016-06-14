import React from 'react';
import { FormattedMessage } from 'react-intl';

const Error404 = () => {
  return (
    <div className="error404">
      <h3><FormattedMessage id="app.404"/></h3>
    </div>
  )
}

Error404.displayName = "Error404";

module.exports = Error404;
export default Error404;