import React from 'react';
import { Components, withList } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import Button from 'react-bootstrap/lib/Button';

import AdminUsersItem from './AdminUsersItem.jsx';

const AdminUsersList = ({results, loading, loadMore, count, totalCount, networkStatus}) => {
  
  if (loading) {
    return <Components.Loading />;
  }

  const isLoadingMore = networkStatus === 2;
  const hasMore = totalCount > results.length;

  return (
    <div className="admin-users-list">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Groups</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map(user => <AdminUsersItem user={user} key={user._id}/>)}
        </tbody>
      </table>
      <div className="admin-users-load-more">
        {hasMore ? 
          isLoadingMore ? 
            <Components.Loading/> 
            : <Button bsStyle="primary" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</Button> 
          : null
        }
      </div>
    </div>
  )
}

const options = {
  collection: Users,
  fragmentName: 'UsersCurrent',
  terms: {view: 'usersAdmin'},
  limit: 20
}

export default withList(options)(AdminUsersList);