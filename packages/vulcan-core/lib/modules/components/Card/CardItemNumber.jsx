import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// Number
const CardItemNumber = ({ value }) => <code className="contents-number">{value.toString()}</code>;
registerComponent({ name: 'CardItemNumber', component: CardItemNumber });
