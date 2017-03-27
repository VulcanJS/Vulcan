import React from 'react';
import './Button.jsx';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class Buttons extends React.Component {
  render () {
    let { buttons = {}, className = "buttons" } = this.props;
    return (
      <div className={ className }>
        {Object.keys(buttons).map((id, i) =>
          <Components.AccountsButton {...buttons[id]} key={i} />
        )}
      </div>
    );
  }
};

registerComponent('AccountsButtons', Buttons);