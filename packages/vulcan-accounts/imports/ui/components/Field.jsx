import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

const autocompleteValues = {
  'username': 'username',
  'usernameOrEmail': 'email',
  'email': 'email',
  'password': 'current-password'
}

export class AccountsField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mount: true
    };
  }

  triggerUpdate() {
    // Trigger an onChange on inital load, to support browser prefilled values.
    const { onChange } = this.props;
    if (this.input && onChange) {
      onChange({ target: { value: this.input.value } });
    }
  }

  componentDidMount() {
    this.triggerUpdate();
  }

  componentDidUpdate(prevProps) {
    // Re-mount component so that we don't expose browser prefilled passwords if the component was
    // a password before and now something else.
    if (prevProps.id !== this.props.id) {
      this.setState({mount: false});
    }
    else if (!this.state.mount) {
      this.setState({mount: true});
      this.triggerUpdate();
    }
  }

  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      // required = false,
      className = 'field',
      defaultValue = '',
      message,
    } = this.props;
    const { mount = true } = this.state;
    if (type == 'notice') {
      return <div className={ className }>{ label }</div>;
    }
    
    const autoComplete = autocompleteValues[id];

    return mount ? (
      <div className={ className } style={{marginBottom: '10px'}}>
        <Components.FormControl id={ id } type={ type } inputRef={ref => { this.input = ref; }} onChange={ onChange } placeholder={ hint } defaultValue={ defaultValue } autoComplete={autoComplete }/>
        {message && (
          <span className={['message', message.type].join(' ').trim()}>
            {message.message}</span>
        )}
      </div>
    ) : null;
  }
}
AccountsField.propTypes = {
  onChange: PropTypes.func
};

registerComponent('AccountsField', AccountsField)