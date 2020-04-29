import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { Link } from 'react-router-dom';
import without from 'lodash/without';

// Object
const CardItemObject = ({ value: object, Components }) => {
  if (object.__typename === 'User') {
    const user = object;

    return (
      <div className="dashboard-user" style={{ whiteSpace: 'nowrap' }}>
        <Components.Avatar size="small" user={user} link />
        {user.pagePath ? <Link to={user.pagePath}>{user.displayName}</Link> : <span>{user.displayName}</span>}
      </div>
    );
  } else {
    return (
      <table className="table table-bordered">
        <tbody>
          {without(Object.keys(object), '__typename').map(key => (
            <tr key={key}>
              <td>
                <strong>{key}</strong>
              </td>
              <td>
                <Components.CardItemSwitcher value={object[key]} typeName={typeof object[key]} Components={Components} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};
registerComponent({ name: 'CardItemObject', component: CardItemObject });
