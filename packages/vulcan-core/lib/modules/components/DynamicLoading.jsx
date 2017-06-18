import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:lib';

const DynamicLoading = ({ isLoading, pastDelay, error }) => {
  if (isLoading && pastDelay) {
    return <Components.Loading/>;
  } else if (error && !isLoading) {
    console.log(error)
    return <p>Error!</p>;
  } else {
    return null;
  }
}

registerComponent('DynamicLoading', DynamicLoading);

export default DynamicLoading;