import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Components } from 'meteor/vulcan:core';


//noinspection JSUnusedGlobalSymbols
const MuiFormControl = createReactClass({
  
  propTypes: {
    label: PropTypes.node,
    children: PropTypes.node,
    optional: PropTypes.bool,
    hasErrors: PropTypes.bool,
    fakeLabel: PropTypes.bool,
    hideLabel: PropTypes.bool,
    layout: PropTypes.oneOf(['horizontal', 'vertical', 'elementOnly']),
    htmlFor: PropTypes.string,
    inputType: PropTypes.string,
  },
  
  renderLabel: function () {
    if (this.props.layout === 'elementOnly' || this.props.hideLabel) {
      return null;
    }
    
    if (this.props.fakeLabel) {
      return (
        <FormLabel className="control-label legend"
                   component="legend"
                   data-required={!this.props.optional}
        >
          {this.props.label}<Components.RequiredIndicator optional={this.props.optional} value={this.props.value}/>
        </FormLabel>
      );
    }
    
    const shrink = ['date', 'time', 'datetime'].includes(this.props.inputType) ? true : undefined;
    
    return (
      <InputLabel className="control-label"
                  data-required={!this.props.optional}
                  htmlFor={this.props.htmlFor}
                  shrink={shrink}
      >
        {this.props.label}<Components.RequiredIndicator optional={this.props.optional} value={this.props.value}/>
      </InputLabel>
    );
  },
  
  render: function () {
    const { layout, className, children, hasErrors } = this.props;
    
    if (layout === 'elementOnly') {
      return <span>{children}</span>;
    }
    
    return (
      <FormControl component="fieldset" error={hasErrors} fullWidth={true} className={className}>
        {this.renderLabel()}
        {children}
      </FormControl>
    );
  }
  
});


export default MuiFormControl;
