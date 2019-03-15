import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { replaceComponent } from 'meteor/vulcan:core';
import TextField from '@material-ui/core/TextField';


const autocompleteValues = {
  'username': 'username',
  'usernameOrEmail': 'email',
  'email': 'email',
  'password': 'current-password'
};


export class AccountsField extends PureComponent {
  
  
  constructor (props) {
    super(props);
    this.state = {
      mount: true
    };
  }
  
  
  triggerUpdate () {
    // Trigger an onChange on initial load, to support browser pre-filled values.
    const { onChange } = this.props;
    if (this.input && onChange) {
      onChange({ target: { value: this.input.value } });
    }
  }
  
  
  componentDidMount () {
    this.triggerUpdate();
  }
  
  
  componentDidUpdate (prevProps) {
    // Re-mount component so that we don't expose browser pre-filled passwords if the component was
    // a password before and now something else.
    if (prevProps.id !== this.props.id) {
      this.setState({ mount: false });
    } else if (!this.state.mount) {
      this.setState({ mount: true });
      this.triggerUpdate();
    }
  }
  
  
  render () {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className = 'field',
      defaultValue = '',
      autoFocus,
      messages,
    } = this.props;
    let { message } = this.props;
    const { mount = true } = this.state;
    
    if (type === 'notice') {
      return <div className={className}>{label}</div>;
    }
  
    const autoComplete = autocompleteValues[id];
    
    if (messages && messages.find && typeof id === 'string') {
      const foundMessage = messages.find(element => {
        if (typeof element.field !== 'string') return false;
        return id.toLowerCase().indexOf(element.field.toLowerCase()) > -1;
      });
      if (foundMessage) {
        message = foundMessage;
      }
    }
  
    return (
      mount &&
      
      <div className={className} style={{ marginBottom: '10px' }}>
        <TextField
          id={id}
          type={type}
          inputRef={ref => { this.input = ref; }}
          onChange={onChange}
          placeholder={hint}
          defaultValue={defaultValue}
          autoComplete={autoComplete }
          label={label}
          autoFocus={autoFocus}
          required={required}
          error={!!message}
          helperText={message && message.message}
          fullWidth
        />
      </div>
    );
  }
}


AccountsField.propTypes = {
  onChange: PropTypes.func,
};


replaceComponent('AccountsField', AccountsField);
