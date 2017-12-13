import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const MoviesAdhoc = (props, context) => {

  let adhoc=JSON.stringify(props.location.query);
  return <Components.MoviesPage slug={adhoc} />

}


MoviesAdhoc.displayName = "MoviesAdhoc";

registerComponent('MoviesAdhoc', MoviesAdhoc);
