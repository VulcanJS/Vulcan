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
    const { name, options, label, onChange, value } = this.props;
  
    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      onChange,
      value,
      ...this.props.inputProperties,
    };
  
    return {
      ...this.props,
      inputProperties,
    };
  };
  
  renderExtraComponent = (extraComponent) => {
    if (!extraComponent) return null;
  
    const properties = this.getProperties();
    
    return instantiateComponent(extraComponent, properties);
  };
  
  
  renderComponent = () => {
    const { input, inputType, formType } = this.props;
    const properties = this.getProperties();
  
    // if input is a React component, use it
    if (typeof input === 'function') {
      const InputComponent = input;
      return <InputComponent {...properties} />;
    } else {
      // else pick a predefined component
      
      switch (inputType) {
        case 'nested':
          return <Components.FormNested {...properties} />;
        
        case 'number':
          return <Components.FormComponentNumber {...properties} />;
        
        case 'url':
          return <Components.FormComponentUrl {...properties} />;
        
        case 'email':
          return <Components.FormComponentEmail {...properties} />;
        
        case 'textarea':
          return <Components.FormComponentTextarea {...properties} />;
        
        case 'checkbox':
          // formsy-react-components expects a boolean value for checkbox
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox.js#L20
          properties.inputProperties.value = !!properties.inputProperties.value;
          return <Components.FormComponentCheckbox {...properties} />;
        
        case 'checkboxgroup':
          // formsy-react-components expects an array value
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox-group.js#L42
          if (!Array.isArray(properties.inputProperties.value)) {
            properties.inputProperties.value = [properties.inputProperties.value];
          }
          // in case of checkbox groups, check "checked" option to populate value if this is a "new
          // document" form
          const checkedValues = _.where(properties.options, { checked: true })
          .map(option => option.value);
          if (checkedValues.length && !properties.inputProperties.value && formType === 'new') {
            properties.inputProperties.value = checkedValues;
          }
          return <Components.FormComponentCheckboxGroup {...properties} />;
        
        case 'radiogroup':
          // TODO: remove this?
          // formsy-react-compnents RadioGroup expects an onChange callback
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/radio-group.js#L33
          // properties.onChange = (name, value) => {
          //   this.context.updateCurrentValues({ [name]: value });
          // };
          return <Components.FormComponentRadioGroup {...properties} />;
        
        case 'select':
          const noneOption = {
            label: this.context.intl.formatMessage({ id: 'forms.select_option' }),
            value: '',
            disabled: true,
          };
          properties.inputProperties.options = [noneOption, ...properties.inputProperties.options];
          
          return <Components.FormComponentSelect {...properties} />;
        
        case 'selectmultiple':
          properties.inputProperties.multiple = true;
          return <Components.FormComponentSelect {...properties} />;
        
        case 'datetime':
          return <Components.FormComponentDateTime {...properties} />;
        
        case 'date':
          return <Components.FormComponentDate {...properties} />;
        
        case 'time':
          return <Components.FormComponentTime {...properties} />;
        
        case 'text':
          return <Components.FormComponentDefault {...properties} />;
        
        default:
          const CustomComponent = Components[input];
          return CustomComponent ? (
            <CustomComponent {...properties} />
          ) : (
            <Components.FormComponentDefault {...properties} />
          );
      }
    }
  };
  
  render () {
    const {
      inputClassName,
      name,
      input,
      beforeComponent,
      afterComponent,
      errors,
      showCharsRemaining,
      charsRemaining,
    } = this.props;
    
    const hasErrors = errors && errors.length;
    
    const inputName = typeof input === 'function' ? input.name : input;
    const inputClass = classNames('form-input', inputClassName, `input-${name}`,
      `form-component-${inputName || 'default'}`, { 'input-error': hasErrors, });
    
    return (
      <div className={inputClass}>
        {this.renderExtraComponent(beforeComponent)}
        {this.renderComponent()}
        {hasErrors ? <Components.FieldErrors errors={errors}/> : null}
        {this.renderClear()}
        {showCharsRemaining &&
          <div className={classNames('form-control-limit', { danger: charsRemaining < 10 })}>
            {charsRemaining}
          </div>
        }
        {this.renderExtraComponent(afterComponent)}
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
};

FormComponentInner.contextTypes = {
  intl: intlShape,
};

FormComponentInner.displayName = 'FormComponentInner';


registerComponent('FormComponentInner', FormComponentInner);
