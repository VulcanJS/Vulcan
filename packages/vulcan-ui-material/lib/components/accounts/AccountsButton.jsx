import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { replaceComponent, Utils } from 'meteor/vulcan:core';
import classNames from 'classnames';


export class AccountsButton extends Component {
  render() {

    const {
      label,
      type,
      disabled = false,
      className,
      onClick
    } = this.props;

    return (
      <Button
        variant={type === 'link' ? 'text' : 'contained'}
        size={type === 'link' ? 'small' : undefined}
        color="primary"
        className={classNames(`button-${Utils.slugify(label)}`, className)}
        type={type === 'link' ? 'button' : type}
        disabled={disabled}
        onClick={onClick}
        disableRipple={true}
      >
        {label}
      </Button>
    );
  }
}


AccountsButton.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['link', 'submit', 'button']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};


replaceComponent('AccountsButton', AccountsButton);
