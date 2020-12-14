import { Components, registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

const Error404 = () => {
  return (
    <div className="error404">
      <h3>
        <Components.FormattedMessage id="app.404" defaultMessage="Sorry, we couldn't find what you were looking for." />
      </h3>
    </div>
  );
};

Error404.displayName = 'Error404';

registerComponent('Error404', Error404);

export default Error404;
