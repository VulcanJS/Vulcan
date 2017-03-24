import React from 'react';
import { Button } from 'react-bootstrap';
import { registerComponent } from 'meteor/vulcan:core';

export class AccountsButton extends React.Component {
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
  onClick: React.PropTypes.func
};

registerComponent('AccountsButton', AccountsButton);