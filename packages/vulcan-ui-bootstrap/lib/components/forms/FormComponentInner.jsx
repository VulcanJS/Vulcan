import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components, registerComponent, instantiateComponent } from 'meteor/vulcan:core';
import classNames from 'classnames';

class FormComponentInner extends PureComponent {
  renderClear = () => {
    if (['datetime', 'time', 'select', 'radiogroup'].includes(this.props.input)) {
      return (
        <a
          href="javascript:void(0)"
          className="form-component-clear"
          title={this.context.intl.formatMessage({ id: 'forms.clear_field' })}
          onClick={this.props.clearField}
        >
          <span>✕</span>
        </a>
      );
    }
  };

  getProperties = () => {
    const { name, options, label, onChange, value, disabled } = this.props;

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      onChange,
      value,
      disabled,
      ...this.props.inputProperties,
    };

    return {
      ...this.props,
      inputProperties,
    };
  };

  render() {
    const {
      inputClassName,
      name,
      input,
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

    const inputName = typeof input === 'function' ? input.name : input;
    const inputClass = classNames(
      'form-input',
      inputClassName,
      `input-${name}`,
      `form-component-${inputName || 'default'}`,
      { 'input-error': hasErrors }
    );
    const properties = this.getProperties();

    const FormInput = this.props.formInput;

    return (
      <div className={inputClass}>
        {instantiateComponent(beforeComponent, properties)}
        <FormInput {...properties}/>
        {hasErrors ? <FormComponents.FieldErrors errors={errors} /> : null}
        {this.renderClear()}
        {showCharsRemaining && (
          <div className={classNames('form-control-limit', { danger: charsRemaining < 10 })}>{charsRemaining}</div>
        )}
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
  onChange: PropTypes.func.isRequired,
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
