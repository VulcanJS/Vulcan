import React, { Component } from 'react';
import { Components, registerComponent, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';
import Users from "meteor/vulcan:users";

class UsersList extends Component {

  render () {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const loading = this.props.loading;

    return (
      <div>
        <div><h5>{this.props.title}</h5></div>
        <div>
          {
            loading ? <Loading /> :
            <div>
              {
                results.map(user =>
                  <div key={user._id} className="top-contributors">
                    <Components.UsersAvatar user={user} size="small"/>
                    <Components.UsersName user={user}/>
                    <span>({user.karma}&nbsp;karma)</span>
                  </div>
                )
              }
            </div>
          }
        </div>
      </div>
    )
  }

}

const usersOptions = {
  collection: Users,
  queryName: 'usersListQuery',
  fragmentName: 'UsersList',
  limit: 10,
  totalResolver: false,
};

registerComponent('UsersList', UsersList, [withList, usersOptions], withCurrentUser);


class TopContributors extends Component {

  render() {
    return (
      <Components.UsersList title='Top Contributors' terms={{view: 'topContributors'}} />
    )
  }

}

registerComponent('TopContributors', TopContributors);
