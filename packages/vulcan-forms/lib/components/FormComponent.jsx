import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import debounce from 'lodash.debounce';
import get from 'lodash/get';
import merge from 'lodash/merge';
import find from 'lodash/find';
import isObjectLike from 'lodash/isObjectLike';
import { isEmptyValue } from '../modules/utils.js';

class FormComponent extends Component {
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { currentValues, deletedValues, errors } = nextProps;
  //   const { path } = this.props;
  //   const hasChanged = currentValues[path] && currentValues[path] !== this.props.currentValues[path];
  //   const hasError = !!errors[path];
  //   const hasBeenDeleted = deletedValues.includes(path) && !this.props.deletedValues.includes(path)
  //   return hasChanged || hasError || hasBeenDeleted;
  // }

  /*

  If a locale (e.g. `en`) is specified for a field (e.g. `name`), its path is `field.locale` (e.g. `name.en`)

  */
  getPath = (props) => {
    const p = props || this.props;
    return p.locale ? `${p.path}.${p.locale}`: p.path;
  }

  handleChange = (name, value) => {
    // if value is an empty string, delete the field
    if (value === '') {
      value = null;
    }
    // if this is a number field, convert value before sending it up to Form
    if (this.getType() === 'number') {
      value = Number(value);
    }

    this.props.updateCurrentValues({ [this.getPath()]: value });

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
  getValue = props => {
    let value;
    const p = props || this.props;
    const { document, currentValues, defaultValue, datatype } = p;
    const path = this.getPath(p);
    const documentValue = get(document, path);
    const currentValue = currentValues[path];
    const isDeleted = p.deletedValues.includes(path);

    if (isDeleted) {
      value = '';
    } else {
      if (p.locale) {
         // note: intl fields are of type Object but should be treated as Strings
         value = currentValue || documentValue || '';
      } else if (Array.isArray(currentValue) && find(datatype, ['type', Array])) {
        // for object and arrays, use lodash's merge
        // if field type is array, use [] as merge seed to force result to be an array as well
        value = merge([], documentValue, currentValue);
      } else if (isObjectLike(currentValue) && find(datatype, ['type', Object])) {
        value = merge({}, documentValue, currentValue);
      } else {
        // note: value has to default to '' to make component controlled
        value = currentValue || documentValue || '';
      }
      // replace empty value, which has not been prefilled, by the default value from the schema
      if (isEmptyValue(value)) {
        if (defaultValue) value = defaultValue;
      }
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
    const fieldErrors = this.props.errors.filter(error => error.path === this.props.path);
    return fieldErrors;
  };

  /*

  Get form input type, either based on input props, or by guessing
  based on form field type

  */
  getType = props => {
    const p = props || this.props;
    const fieldType = p.datatype && p.datatype[0].type;
    const autoType =
      fieldType === Number ? 'number' : fieldType === Boolean ? 'checkbox' : fieldType === Date ? 'date' : 'text';
    return p.input || autoType;
  };

  /*

  Build properties object to pass down to component

  */
  getComponentProperties = () => {
    const {
      beforeComponent,
      afterComponent,
      options,
      name,
      label,
      /* 
      
      note: following properties will be passed as part of `...this.props` in `properties`:

      */
      // throwError,
      // updateCurrentValues,
      // currentValues,
      // addToDeletedValues,
      // deletedValues,
      // clearFieldErrors,
      // currentUser,
      // intl,
      // intlInput,
    } = this.props;

    const value = this.getValue();
    const errors = this.getErrors();

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      onChange: this.handleChange,
      value,
      ...this.props.inputProperties,
    };

    // note: we also pass value on props directly
    const properties = {
      ...this.props,
      value,
      errors, // only get errors for the current field
      inputProperties,
    };

    return properties;
  }

  renderComponent() {
    
    const { input, formType } = this.props;
    const properties = this.getComponentProperties();

    // if input is a React component, use it
    if (typeof input === 'function') {  
      const InputComponent = input;
      return <InputComponent {...properties} />;
    } else {
      // else pick a predefined component

      switch (this.getType()) {
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
          // in case of checkbox groups, check "checked" option to populate value if this is a "new document" form
          const checkedValues = _.where(properties.options, { checked: true }).map(option => option.value);
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
  }

  showClear = () => {
    return ['datetime', 'time', 'select', 'radiogroup'].includes(this.props.input);
  };

  clearField = e => {
    e.preventDefault();
    this.props.updateCurrentValues({ [this.props.path]: null });
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
    const { beforeComponent, afterComponent, name, input } = this.props;

    const hasErrors = this.getErrors() && this.getErrors().length;
    const inputName = typeof input === 'function' ? input.name : input;
    const inputClass = classNames('form-input', `input-${name}`, `form-component-${inputName || 'default'}`, {
      'input-error': hasErrors,
    });

  if (this.props.intlInput){
    const properties = this.getComponentProperties();
    return <Components.FormIntl {...properties} />;
  } else {
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
}

FormComponent.propTypes = {
  document: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  prefilledValue: PropTypes.any,
  options: PropTypes.any,
  input: PropTypes.any,
  datatype: PropTypes.any,
  path: PropTypes.string,
  disabled: PropTypes.bool,
  nestedSchema: PropTypes.object,
  currentValues: PropTypes.object,
  deletedValues: PropTypes.array,
  updateCurrentValues: PropTypes.func,
  errors: PropTypes.array,
  addToDeletedValues: PropTypes.func,
};

FormComponent.contextTypes = {
  intl: intlShape,
  getDocument: PropTypes.func,
};

registerComponent('FormComponent', FormComponent);
