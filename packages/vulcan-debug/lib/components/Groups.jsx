import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';

const Group = ({name, actions}) => {
  return (
    <tr>
      <td>{name}</td>
      <td><ul>{actions.map((action, index) => <li key={index}><code>{action}</code></li>)}</ul></td>
    </tr>
  )
}

const Groups = props => {
  return (
    <div className="groups">
      <h1>Groups</h1>

      <div className="groups-wrapper">

        <table className="table">
          <thead>
            <tr>
              <td><strong>Name</strong></td>
              <td><strong>Actions</strong></td>
            </tr>
          </thead>
          <tbody>
            {_.map(Users.groups, (group, key) => <Group key={key} name={key} actions={group.actions} />)}
          </tbody>
        </table>

      </div>

    </div>
  )
}

registerComponent('Groups', Groups);
