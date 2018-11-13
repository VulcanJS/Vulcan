import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from 'meteor/vulcan:core';
import mergeWithComponents from '../modules/mergeWithComponents';

// Replaceable layout
const FormNestedObjectLayout = ({ hasErrors, label, content }) => (
  <div
    className={`form-group row form-nested ${hasErrors ? 'input-error' : ''}`}
  >
    <label className="control-label col-sm-3">{label}</label>
    <div className="col-sm-9">{content}</div>
  </div>
);
FormNestedObjectLayout.propTypes = {
  hasErrors: PropTypes.bool,
  label: PropTypes.node,
  content: PropTypes.node
};
registerComponent({
  name: 'FormNestedObjectLayout',
  component: FormNestedObjectLayout
});

class FormNestedObject extends PureComponent {
  render() {
    const FormComponents = mergeWithComponents(this.props.formComponents);
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
      <FormComponents.FormNestedObjectLayout
        hasErros={hasErrors}
        label={this.props.label}
        content={[
          <FormComponents.FormNestedItem
            key="form-nested-item"
            {...properties}
            path={`${this.props.path}`}
          />,
          hasErrors ? (
            <FormComponents.FieldErrors
              key="form-nested-errors"
              errors={nestedObjectErrors}
            />
          ) : null
        ]}
      />
    );
  }
}

FormNestedObject.propTypes = {
  currentValues: PropTypes.object,
  path: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.array.isRequired,
  formComponents: PropTypes.object
};

module.exports = FormNestedObject;

registerComponent('FormNestedObject', FormNestedObject);
