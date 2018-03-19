import React from 'react';
import { Components } from 'meteor/vulcan:core';
import moment from 'moment';

const AdminUsersCreated = ({ document: user }) =>
  <div>
    {moment(new Date(user.createdAt)).format('MM/DD/YY')}
  </div>

export default AdminUsersCreated;