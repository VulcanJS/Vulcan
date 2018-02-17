import Users from './collection.js';

Users.addView('usersAdmin', terms => ({
  options: {
    sort: {createdAt: -1}
  }
}));