import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

class FormNestedObject extends PureComponent {
  render() {
    const FormComponents = this.props.formComponents;
    //const value = this.getCurrentValue()
    // do not pass FormNested's own value, input and inputProperties props down
    const properties = _.omit(
      this.props,
      'value',
      'input',
      'inputProperties',
      'nestedInput'
    );
    const { errors } = this.props;
    // only keep errors specific to the nested array (and not its subfields)
    const nestedObjectErrors = errors.filter(
      error => error.path && error.path === this.props.path
    );
    const hasErrors = nestedObjectErrors && nestedObjectErrors.length;
    return (
      <div
        className={`form-group row form-nested ${
          hasErrors ? 'input-error' : ''
        }`}
      >
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <FormComponents.FormNestedItem
            {...properties}
            path={`${this.props.path}`}
          />
          {hasErrors ? (
            <FormComponents.FieldErrors errors={nestedObjectErrors} />
          ) : null}
        </div>
      </div>
    );
  }
}

FormNestedObject.propTypes = {
  currentValues: PropTypes.object,
  path: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.array.isRequired
};

module.exports = FormNestedObject;

registerComponent('FormNestedObject', FormNestedObject);
