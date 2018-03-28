import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import debounce from 'lodash.debounce';
import get from 'lodash/get';
import { isEmptyValue } from '../modules/utils.js';

class FormComponent extends PureComponent {
  constructor(props) {
    super(props);

    const value = this.getValue(props);

    if (this.showCharsRemaining(props)) {
      const characterCount = value ? value.length : 0;
      this.state = {
        charsRemaining: props.max - characterCount,
      };
    }
  }

  handleChange = (name, value) => {
    if (!!value) {
      // if this is a number field, convert value before sending it up to Form
      if (this.getType() === 'number') {
        value = Number(value);
      }
      this.context.updateCurrentValues({ [this.props.path]: value });
    } else {
      this.context.updateCurrentValues({ [this.props.path]: null });
    }

    // for text fields, update character count on change
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(value);
    }
  };

  /*

  Note: not currently used because when function is debounced
  some changes might not register if the user submits form too soon

  */
  handleChangeDebounced = debounce(this.handleChange, 500, { leading: true });

  updateCharacterCount = value => {
    const characterCount = value ? value.length : 0;
    this.setState({
      charsRemaining: this.props.max - characterCount,
    });
  };

  /*

  Get value from Form state through document and currentValues props

  */
  getValue = (props) => {
    const p = props || this.props;
    const { document, currentValues, defaultValue } = p;
    
    // note: value has to default to '' to make component controlled
    let value = currentValues[p.path] || get(document, p.path) || '';

    // replace empty value, which has not been prefilled, by the default value from the schema
    if (isEmptyValue(value)) {
      if (defaultValue) value = defaultValue;
    }
    
    return value;
  };

  /*

  Whether to keep track of and show remaining chars

  */
  showCharsRemaining = props => {
    const p = props || this.props;
    return p.max && ['url', 'email', 'textarea', 'text'].includes(this.getType(p));
  };

  /*

  Get errors from Form state through context

  */
  getErrors = () => {
    const fieldErrors = this.props.errors.filter(error => error.data.name === this.props.path);
    return fieldErrors;
  };

  /*

  Get form control type, either based on control props, or by guessing
  based on form field type

  */
  getType = props => {
    const p = props || this.props;
    const fieldType = p.datatype && p.datatype[0].type;
    const autoType =
      fieldType === Number ? 'number' : fieldType === Boolean ? 'checkbox' : fieldType === Date ? 'date' : 'text';
    return p.control || autoType;
  };

  renderComponent() {
    const {
      control,
      beforeComponent,
      afterComponent,
      options,
      name,
      label,
      form,
      formType,
    } = this.props;

    const value = this.getValue();

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      onChange: this.handleChange,
      value,
      ...form,
    };

    // note: we also pass value on props directly
    const properties = { ...this.props, value, errors: this.getErrors(), inputProperties };
    
    // if control is a React component, use it
    if (typeof control === 'function') {
      const ControlComponent = control;
      return <ControlComponent {...properties} />;
    } else {
      // else pick a predefined component

      switch (this.getType()) {
        case 'nested':
          return  <Components.FormNested {...properties} />;

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
          properties.value = !!properties.value;
          return <Components.FormComponentCheckbox {...properties} />;

        case 'checkboxgroup':
          // formsy-react-components expects an array value
          // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox-group.js#L42
          if (!Array.isArray(properties.value)) {
            properties.value = [properties.value];
          }

          // in case of checkbox groups, check "checked" option to populate value if this is a "new document" form
          const checkedValues = _.where(properties.options, { checked: true }).map(option => option.value);
          if (checkedValues.length && !properties.value && formType === 'new') {
            properties.value = checkedValues;
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
          console.log(properties.options)
          properties.options = [noneOption, ...properties.options];
          return <Components.FormComponentSelect {...properties} />;

        case 'selectmultiple':
          properties.multiple = true;
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
          const CustomComponent = Components[control];
          return CustomComponent ? (
            <CustomComponent {...properties} />
          ) : (
            <Components.FormComponentDefault {...properties} />
          );
      }
    }
  }

  showClear = () => {
    return ['datetime', 'time', 'select', 'radiogroup'].includes(this.props.control);
  };

  clearField = e => {
    e.preventDefault();
    this.context.updateCurrentValues({ [this.props.path]: null });
  };

  renderClear() {
    return (
      <a
        href="javascript:void(0)"
        className="form-component-clear"
        title={this.context.intl.formatMessage({ id: 'forms.clear_field' })}
        onClick={this.clearField}
      >
        <span>✕</span>
      </a>
    );
  }

  render() {
    const { beforeComponent, afterComponent, max, name, control } = this.props;

    const hasErrors = this.getErrors() && this.getErrors().length;
    const inputClass = classNames('form-input', `input-${name}`, `form-component-${control || 'default'}`, {
      'input-error': hasErrors,
    });

    return (
      <div className={inputClass}>
        {beforeComponent ? beforeComponent : null}
        {this.renderComponent()}
        {hasErrors ? <Components.FieldErrors errors={this.getErrors()} /> : null}
        {this.showClear() ? this.renderClear() : null}
        {this.showCharsRemaining() && (
          <div className={classNames('form-control-limit', { danger: this.state.charsRemaining < 10 })}>
            {this.state.charsRemaining}
          </div>
        )}
        {afterComponent ? afterComponent : null}
      </div>
    );
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
  path: PropTypes.string,
  disabled: PropTypes.bool,
  nestedSchema: PropTypes.object,
  currentValues: PropTypes.object,
  errors: PropTypes.array,
};

FormComponent.contextTypes = {
  intl: intlShape,
  addToDeletedValues: PropTypes.func,
  errors: PropTypes.array,
  autofilledValues: PropTypes.object,
  deletedValues: PropTypes.array,
  getDocument: PropTypes.func,
  updateCurrentValues: PropTypes.func,
};

registerComponent('FormComponent', FormComponent);
