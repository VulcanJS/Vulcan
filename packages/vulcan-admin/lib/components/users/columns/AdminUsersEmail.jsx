import React from 'react';
import Users from 'meteor/vulcan:users';
import { Components } from 'meteor/vulcan:core';

const AdminUsersEmail = ({ document: user }) =>
  <a href={`mailto:${Users.getEmail(user)}`}>{Users.getEmail(user)}</a>;

export default AdminUsersEmail;