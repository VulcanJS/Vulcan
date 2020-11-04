import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Components, registerComponent } from 'meteor/vulcan:core';


//noinspection JSUnusedGlobalSymbols
const MuiFormControl = createReactClass({

  propTypes: {
    label: PropTypes.node,
    children: PropTypes.node,
    optional: PropTypes.bool,
    hasErrors: PropTypes.bool,
    fakeLabel: PropTypes.bool,
    hideLabel: PropTypes.bool,
    shrinkLabel: PropTypes.bool,
    layout: PropTypes.oneOf(['horizontal', 'vertical', 'elementOnly', 'shrink']),
    htmlFor: PropTypes.string,
    inputType: PropTypes.string,
  },

  renderLabel: function () {
    const { fakeLabel, hideLabel, shrinkLabel, layout, optional, label, value } = this.props;
    const isRequired = !this.props.optional || this.props.required;
    
    if (layout === 'elementOnly' || hideLabel) {
      return null;
    }

    if (fakeLabel) {
      return (
        <FormLabel className="control-label legend"
                   component="legend"
                   data-required={isRequired}
        >
          {label}<Components.RequiredIndicator optional={!isRequired} value={value}/>
        </FormLabel>
      );
    }

    const shrink = shrinkLabel || ['date', 'time', 'datetime'].includes(this.props.inputType) ? true : undefined;

    return (
      <InputLabel className="control-label"
                  data-required={isRequired}
                  htmlFor={this.props.htmlFor}
                  shrink={shrink}
      >
        {label}<Components.RequiredIndicator optional={!isRequired} value={value}/>
      </InputLabel>
    );
  },

  render: function () {
    const { layout, className, children, hasErrors } = this.props;

    if (layout === 'elementOnly') {
      return <span>{children}</span>;
    }

    return (
      <FormControl component="fieldset" error={hasErrors} fullWidth={layout !== 'shrink'} className={className}>
        {this.renderLabel()}
        {children}
      </FormControl>
    );
  }

});


export default MuiFormControl;


registerComponent('FormControl', MuiFormControl);
