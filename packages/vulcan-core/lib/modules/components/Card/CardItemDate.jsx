import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import moment from 'moment';

// Date
const CardItemDate = ({ value }) => (
  <span className="contents-date">{moment(new Date(value)).format('YYYY/MM/DD, hh:mm')}</span>
);
registerComponent({ name: 'CardItemDate', component: CardItemDate });
