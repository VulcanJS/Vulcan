import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// String
const CardItemString = ({ string }) => (
  <div className="contents-string">
    {string.indexOf(' ') === -1 && string.length > 30 ? (
      <span title={string}>{string.substr(0, 30)}…</span>
    ) : (
      <span>{string}</span>
    )}
  </div>
);
registerComponent({ name: 'CardItemString', component: CardItemString });
