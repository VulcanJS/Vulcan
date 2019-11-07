import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// URL
const CardItemURL = ({ value, force, Components }) => {
  return force || value.slice(0, 4) === 'http' ? (
    <a className="contents-link" href={value} target="_blank" rel="noopener noreferrer">
      <Components.CardItemString string={value} />
    </a>
  ) : (
    <Components.CardItemString string={value} />
  );
};
registerComponent({ name: 'CardItemURL', component: CardItemURL });
