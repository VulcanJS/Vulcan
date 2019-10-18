import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';

// Default
const CardItemDefault = ({ value }) => <span>{value.toString()}</span>;
registerComponent({ name: 'CardItemDefault', component: CardItemDefault });
