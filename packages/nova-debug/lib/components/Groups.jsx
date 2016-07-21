import React from 'react';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from 'meteor/nova:users';

const Group = ({name, actions}) => {
  return (
    <tr>
      <td>{name}</td>
      <td><ul>{actions.map(action => <li><code>{action}</code></li>)}</ul></td>
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


module.exports = Groups
export default Groups