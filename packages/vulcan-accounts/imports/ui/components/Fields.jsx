import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsFields extends React.Component {
  render () {
    let { fields = {}, className = "fields" } = this.props;
    return (
      <div className={ className }>
        {Object.keys(fields).map((id, i) =>
          <Components.AccountsField {...fields[id]} key={i} />
        )}
      </div>
    );
  }
}

registerComponent('AccountsFields', AccountsFields);