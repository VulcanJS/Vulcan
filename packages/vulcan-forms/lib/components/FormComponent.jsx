import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import { isEmptyValue } from '../modules/utils';

class FormComponent extends PureComponent {

  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.updateCharacterCount = this.updateCharacterCount.bind(this);
    this.renderErrors = this.renderErrors.bind(this);

    if (props.limit) {
      this.state = {
        limit: props.value ? props.limit - props.value.length : props.limit
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateCharacterCount(nextProps.name, nextProps.value)
  }

  handleBlur() {
    // see https://facebook.github.io/react/docs/more-about-refs.html
    if (this.formControl && this.formControl.getValue) {
      this.props.updateCurrentValues({[this.props.name]: this.formControl.getValue()});
    }
  }

  updateCharacterCount(name, value) {
    if (this.props.limit) {
      const characterCount = value ? value.length : 0;
      this.setState({
        limit: this.props.limit - characterCount
      });
    }
  }

  renderComponent() {

    // see https://facebook.github.io/react/warnings/unknown-prop.html
    const { control, group, updateCurrentValues, document, beforeComponent, afterComponent, limit, errors, ...rest } = this.props; // eslint-disable-line

    // const base = typeof this.props.control === 'function' ? this.props : rest;

    const properties = {
      value: '', // default value, will be overridden by `rest` if real value has been passed down through props
      ...rest,
      onBlur: this.handleBlur,
      refFunction: (ref) => this.formControl = ref,
    };

    // for text fields, update character count on change
    if (!this.props.control || ['number', 'url', 'email', 'textarea', 'text'].includes(this.props.control)) {
      properties.onChange = this.updateCharacterCount;
    }

    // if control is a React component, use it
    if (typeof this.props.control === 'function') {

      return <this.props.control {...properties} document={document} />

    } else if (typeof this.props.control === 'string') { // else pick a predefined component

      switch (this.props.control) {

        case 'number':
          return <Components.FormComponentNumber {...properties}/>;

        case 'url':
          return <Components.FormComponentUrl {...properties}/>;

        case 'email':
          return <Components.FormComponentEmail {...properties}/>;

        case 'textarea':
          return <Components.FormComponentTextarea {...properties}/>;

        case 'checkbox':
          // formsy-react-components expects a boolean value for checkbox
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox.js#L20
          properties.value = !!properties.value;
          return <Components.FormComponentCheckbox {...properties} />;

        case 'checkboxgroup':
          // formsy-react-components expects an array value
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox-group.js#L42
          if (!Array.isArray(properties.value)) {
            properties.value = [properties.value];
          }
          return <Components.FormComponentCheckboxGroup {...properties} />;

        case 'radiogroup':
          // formsy-react-compnents RadioGroup expects an onChange callback
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/radio-group.js#L33
          properties.onChange = (name, value) => {this.props.updateCurrentValues({[name]: value})};
          return <Components.FormComponentRadioGroup {...properties} />;

        case 'select':

          const noneOption = {
            label: this.context.intl.formatMessage({id: 'forms.select_option'}), 
            value: '', 
            disabled: true
          };

          properties.options = [noneOption, ...properties.options];
          return <Components.FormComponentSelect {...properties} />;

        case 'selectmultiple':
          properties.multiple = true;
          return <Components.FormComponentSelect {...properties} />;

        case 'datetime':
          return <Components.FormComponentDateTime {...properties} />;

        case 'time':
          return <Components.FormComponentTime {...properties} />;

        case 'text':
          return <Components.FormComponentDefault {...properties}/>;

        default: 
          const CustomComponent = Components[this.props.control];
          return <CustomComponent {...properties} document={document}/>;
      }

    } else {
        
      return <Components.FormComponentDefault {...properties}/>;

    }
  }

  renderErrors() {
    return (
      <ul className='form-input-errors'>
        {this.props.errors.map((error, index) => <li key={index}>{error.message}</li>)}
      </ul>
    )
  }

  showClear = () => {
    return ['datetime', 'time', 'select', 'radiogroup'].includes(this.props.control);
  }

  clearField = (e) => {
    e.preventDefault();
    const fieldName = this.props.name;
    // clear value
    this.props.updateCurrentValues({[fieldName]: null});
    // add it to unset
    this.context.addToDeletedValues(fieldName);
  }

  renderClear() {
    return (
      <a href="javascript:void(0)" className="form-component-clear" title={this.context.intl.formatMessage({id: 'forms.clear_field'})} onClick={this.clearField}><span>✕</span></a>
    )
  }

  render() {

    const hasErrors = this.props.errors && this.props.errors.length;
    const inputClass = classNames('form-input', `input-${this.props.name}`, `form-component-${this.props.control || 'default'}`,{'input-error': hasErrors});

    return (
      <div className={inputClass}>
        {this.props.beforeComponent ? this.props.beforeComponent : null}
        {this.renderComponent()}
        {hasErrors ? this.renderErrors() : null}
        {this.showClear() ? this.renderClear() : null}
        {this.props.limit ? <div className={classNames('form-control-limit', {danger: this.state.limit < 10})}>{this.state.limit}</div> : null}
        {this.props.afterComponent ? this.props.afterComponent : null}
      </div>
    )
  }

}

FormComponent.propTypes = {
  document: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  prefilledValue: PropTypes.any,
  options: PropTypes.any,
  control: PropTypes.any,
  datatype: PropTypes.any,
  disabled: PropTypes.bool,
  updateCurrentValues: PropTypes.func
}

FormComponent.contextTypes = {
  intl: intlShape,
  addToDeletedValues: PropTypes.func,
};

registerComponent('FormComponent', FormComponent);
