import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { isEmptyValue } from '../modules/utils.js';

class FormComponent extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  componentWillMount () {
    if (this.showCharsRemaining()) {
      const value = this.getValue();
      this.updateCharacterCount(value);
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // allow custom controls to determine if they should update
    if (!['nested', 'number', 'url', 'email', 'textarea', 'checkbox', 
      'checkboxgroup', 'radiogroup', 'select', 'selectmultiple', 'datetime', 
      'date', 'time', 'text'].includes(this.getType(nextProps))) {
      return true;
    }
    
    // getHidden allows controls to show/hide based on the value of other form fields
    if (nextProps.form && typeof nextProps.form.getHidden === 'function') {
      return true;
    }
    
    const { currentValues, deletedValues, errors } = nextProps;
    const { path } = this.props;
    
    const valueChanged = currentValues[path] !== this.props.currentValues[path];
    const errorChanged = this.getErrors(errors) !== this.getErrors();
    const deleteChanged = deletedValues.includes(path) !== this.props.deletedValues.includes(path);
    const charsChanged = nextState.charsRemaining !== this.state.charsRemaining;
    return valueChanged || errorChanged || deleteChanged || charsChanged;
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
    this.props.updateCurrentValues({ [this.props.path]: value });

    // for text fields, update character count on change
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(value);
    }
  };

  updateCharacterCount = value => {
    const characterCount = value ? value.length : 0;
    this.setState({
      charsRemaining: this.props.max - characterCount,
      charsCount: characterCount,
    });
  };

  /*

  Get value from Form state through document and currentValues props

  */
  getValue = props => {
    let value;
    const p = props || this.props;
    const { document, currentValues, defaultValue, path, datatype } = p;
    const documentValue = get(document, path);
    const currentValue = currentValues[path];
    const isDeleted = p.deletedValues.includes(path);

    if (isDeleted) {
      value = '';
    } else {
      if (datatype[0].type === Array) {
        // for object and arrays, use lodash's merge
        // if field type is array, use [] as merge seed to force result to be an array as well
        value = merge([], documentValue, currentValue);
      } else if (datatype[0].type === Object) {
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
  getErrors = (errors) => {
    errors = errors || this.props.errors;
    const fieldErrors = errors.filter(error => error.path === this.props.path);
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
      fieldType === Number ? 'number' :
        fieldType === Boolean ? 'checkbox' : 
          fieldType === Date ? 
            'date' : 
            'text';
    return p.input || autoType;
  };

  renderComponent = () => {
    const {
      input,
      options,
      name,
      label,
      help,
      placeholder,
      formType,
      form,
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
    } = this.props;

    const value = this.getValue();
    const errors = this.getErrors();
    const document = this.context.getDocument();

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      help,
      placeholder,
      onChange: this.handleChange,
      value,
      errors,
      document,
      ...form,
      ...this.props.inputProperties,
    };

    // note: we also pass value on props directly
    const properties = {
      ...this.props,
      value,
      errors,
      document,
      inputProperties,
    };

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

  clearField = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.updateCurrentValues({ [this.props.path]: null });
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(null);
    }
  };

  renderClear = () => {
    if (['datetime', 'time', 'select', 'radiogroup'].includes(this.props.input)) {
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
  };
  
  renderExtraComponent = extraComponent => {
    if (!extraComponent) return null;
    
    const value = this.getValue();
    
    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name: this.props.name,
      options: this.props.options,
      label: this.props.label,
      onChange: this.handleChange,
      value,
      ...this.props.form,
    };
    
    // note: we also pass value on props directly
    const properties = {
      ...this.props,
      value,
      errors: this.getErrors(),
      inputProperties,
    };
    
    if (typeof extraComponent === 'string') {
      const ExtraComponent = Components[extraComponent];
      return <ExtraComponent {...properties} />;
    } else {
      return extraComponent;
    }
  }

  render () {
    const { inputClassName, name, input, beforeComponent, afterComponent, help, max, getHidden } = this.props;

    if (typeof getHidden === 'function') {
      const document = this.context.getDocument();
      if (getHidden.call({document})) {
        return null;
      }
    }

    return (
      <Components.FormComponentUi
        inputClassName={inputClassName}
        name={name}
        input={input}
        beforeComponent={beforeComponent}
        afterComponent={afterComponent}
        renderExtraComponent={this.renderExtraComponent}
        renderComponent={this.renderComponent}
        renderClear={this.renderClear}
        getErrors={this.getErrors}
        help={help}
        showCharsRemaining={this.showCharsRemaining}
        charsRemaining={this.state.charsRemaining}
        charsCount={this.state.charsCount}
        charsMax={max}
      />
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
  getDocument: PropTypes.func.isRequired,
};

registerComponent('FormComponent', FormComponent);
