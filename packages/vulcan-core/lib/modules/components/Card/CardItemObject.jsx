import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import { Link } from 'react-router-dom';
import without from 'lodash/without';

// Object
const CardItemObject = props => {
  const { nestingLevel, value, Components, showExpand } = props;
  const showExpandControl = showExpand || nestingLevel > 1;
  if (value.__typename === 'User') {
    const user = value;

    return (
      <div className="dashboard-user" style={{ whiteSpace: 'nowrap' }}>
        <Components.Avatar size="small" user={user} link />
        {user.pagePath ? <Link to={user.pagePath}>{user.displayName}</Link> : <span>{user.displayName}</span>}
      </div>
    );
  } else {
    return (
      <div className="card-item-details">
        {showExpandControl ? (
          <details>
            <summary>Expand</summary>
            <CardItemObjectContents {...props} />
          </details>
        ) : (
          <CardItemObjectContents {...props} />
        )}
      </div>
    );
  }
};

const CardItemObjectContents = ({ nestingLevel, value: object, Components }) => (
  <table className="table table-bordered">
    <tbody>
      {without(Object.keys(object), '__typename').map(key => (
        <tr key={key}>
          <td>
            <strong>{key}</strong>
          </td>
          <td>
            <Components.CardItemSwitcher
              nestingLevel={nestingLevel}
              value={object[key]}
              typeName={typeof object[key]}
              Components={Components}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

registerComponent({ name: 'CardItemObject', component: CardItemObject });
