import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

export class AccountsButton extends PureComponent {
  render () {

    const {
      label,
      // href = null,
      type,
      disabled = false,
      id,
      className,
      onClick
    } = this.props;

    return type === 'link' ? 
      <a
        href="#"
        id={id}
        className={className}
        onClick={onClick}
        style={{marginRight: '10px'}}>
        {label}
      </a> :
      <Components.Button
        style={{marginRight: '10px'}}
        variant="primary"
        id={id}
        className={className}
        type={type}
        disabled={disabled}
        onClick={onClick}>
        {label}
      </Components.Button>;
  }
}
AccountsButton.propTypes = {
  onClick: PropTypes.func
};

registerComponent('AccountsButton', AccountsButton);
