import React from 'react';
import './Button.jsx';
import { Accounts } from 'meteor/accounts-base';

export class Buttons extends React.Component {
  render () {
    let { buttons = {}, className = "buttons" } = this.props;
    return (
      <div className={ className }>
        {Object.keys(buttons).map((id, i) =>
          <Accounts.ui.Button {...buttons[id]} key={i} />
        )}
      </div>
    );
  }
};

Accounts.ui.Buttons = Buttons;
