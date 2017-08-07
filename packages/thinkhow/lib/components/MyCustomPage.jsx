/*
A new custom page just for our app.
Browse to http://localhost:3000/my-custom-route to see it.
*/

import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const MyCustomPage = () => {
  return (
    <div>
      <h2>Welcome To My Custom Page!</h2>
      <p>Nice to meet you.</p>
    </div>
  )
}

registerComponent('MyCustomPage', MyCustomPage);
