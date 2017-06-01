import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/lib/Button';
import { registerComponent } from 'meteor/vulcan:core';

export class AccountsButton extends PureComponent {
  render () {

    const {
      label,
      href = null,
      type,
      disabled = false,
      className,
      onClick
    } = this.props;

    return type === 'link' ? 
      <a href="#" className={ className } onClick={ onClick } style={{marginRight: '10px'}}>{ label }</a> :
      <Button
        style={{marginRight: '10px'}}
        bsStyle="primary"
        className={ className }
        type={ type }
        disabled={ disabled }
        onClick={ onClick }>
        { label }
      </Button>;
  }
}
AccountsButton.propTypes = {
  onClick: PropTypes.func
};

registerComponent('AccountsButton', AccountsButton);