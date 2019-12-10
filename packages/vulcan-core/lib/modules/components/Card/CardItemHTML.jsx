import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// HTML
const CardItemHTML = ({ value }) => (
  <div className="contents-html" dangerouslySetInnerHTML={{ __html: value }} />
);
registerComponent({ name: 'CardItemHTML', component: CardItemHTML });