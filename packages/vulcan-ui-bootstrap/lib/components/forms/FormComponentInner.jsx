import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent, instantiateComponent, whitelistInputProps } from 'meteor/vulcan:core';
import classNames from 'classnames';

class FormComponentInner extends PureComponent {

  getProperties = () => {
    const { handleChange, inputType, itemProperties, help, description, loading, submitForm, formComponents, intlKeys } = this.props;
    const properties = {
      ...this.props,

      inputProperties: {
        ...whitelistInputProps(this.props),
        onChange: event => {
          // FormComponent's handleChange expects value as argument; look in target.checked or target.value
          const inputValue = inputType === 'checkbox' ? event.target.checked : event.target.value;
          handleChange(inputValue);
        },
        onKeyPress: event => {
          if (event.key === 'Enter' && inputType !== 'textarea') {
            submitForm();
          }
        },
      },

      itemProperties: {
        ...itemProperties,
        intlKeys,
        Components: formComponents,
        description: description || help,
        loading,
      },
    };
    return properties;
  };

  render() {
    const {
      inputClassName,
      name,
      input,
      inputType,
      beforeComponent,
      afterComponent,
      errors,
      showCharsRemaining,
      charsRemaining,
      renderComponent,
      formComponents,
    } = this.props;

    const FormComponents = formComponents;

    const hasErrors = errors && errors.length;

    const inputName = typeof input === 'function' ? input.name : inputType;
    const inputClass = classNames('form-input', inputClassName, `input-${name}`, `form-component-${inputName || 'default'}`, {
      'input-error': hasErrors,
    });
    const properties = this.getProperties();

    const FormInput = this.props.formInput;

    return (
      <div className={inputClass}>
        {instantiateComponent(beforeComponent, properties)}
        <FormInput {...properties} />
        {hasErrors ? <FormComponents.FieldErrors errors={errors} /> : null}
        <Components.FormClear {...properties} />
        {showCharsRemaining && <div className={classNames('form-control-limit', { danger: charsRemaining < 10 })}>{charsRemaining}</div>}
        {instantiateComponent(afterComponent, properties)}
      </div>
    );
  }
}

FormComponentInner.propTypes = {
  inputClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.any,
  beforeComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  afterComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  clearField: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  help: PropTypes.node,
  handleChange: PropTypes.func.isRequired,
  showCharsRemaining: PropTypes.bool.isRequired,
  charsRemaining: PropTypes.number,
  charsCount: PropTypes.number,
  charsMax: PropTypes.number,
  inputComponent: PropTypes.func,
};

FormComponentInner.contextTypes = {
  intl: intlShape,
};

FormComponentInner.displayName = 'FormComponentInner';

registerComponent('FormComponentInner', FormComponentInner);
