import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { isEmptyValue, mergeValue } from '../modules/utils.js';

class FormComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.showCharsRemaining()) {
      const value = this.getValue();
      this.updateCharacterCount(value);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // allow custom controls to determine if they should update
    if (this.isCustomInput(this.getType(nextProps))) {
      return true;
    }

    const { currentValues, deletedValues, errors } = nextProps;
    const { path } = this.props;

    const valueChanged = get(currentValues, path) !== get(this.props.currentValues, path);
    const errorChanged = !isEqual(this.getErrors(errors), this.getErrors());
    const deleteChanged = deletedValues.includes(path) !== this.props.deletedValues.includes(path);
    const charsChanged = nextState.charsRemaining !== this.state.charsRemaining;
    const disabledChanged = nextProps.disabled !== this.props.disabled;

    return valueChanged || errorChanged || deleteChanged || charsChanged || disabledChanged;
  }

  /*

  If this is an intl input, get _intl field instead

  */
  getPath = props => {
    const p = props || this.props;
    return p.intlInput ? `${p.path}_intl` : p.path;
  };

  /*
  
  Returns true if the passed input type is a custom 
  
  */
  isCustomInput = inputType => {
    const isStandardInput = [
      'nested',
      'number',
      'url',
      'email',
      'textarea',
      'checkbox',
      'checkboxgroup',
      'radiogroup',
      'select',
      'selectmultiple',
      'datetime',
      'date',
      'time',
      'text',
    ].includes(inputType);
    return !isStandardInput;
  };

  /*
  
  Function passed to form controls (always controlled) to update their value
  
  */
  handleChange = (name, value) => {
    // if value is an empty string, delete the field
    if (value === '') {
      value = null;
    }
    // if this is a number field, convert value before sending it up to Form
    if (this.getType() === 'number' && value != null) {
      value = Number(value);
    }

    const updateValue = this.props.locale ? { locale: this.props.locale, value } : value;
    this.props.updateCurrentValues({ [this.getPath()]: updateValue });

    // for text fields, update character count on change
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(value);
    }
  };

  /*
  
  Updates the state of charsCount and charsRemaining as the users types
  
  */
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
    const { document, currentValues, defaultValue } = p;
    // for intl field fetch the actual field value by adding .value to the path
    const path = p.locale ? `${this.getPath(p)}.value` : this.getPath(p);
    const documentValue = get(document, path);
    const currentValue = get(currentValues, path);
    const isDeleted = p.deletedValues.includes(path);

    if (isDeleted) {
      value = '';
    } else {
      value = mergeValue({ currentValue, documentValue, ...p });
      if (typeof value === 'undefined') {
        // note: value has to default to '' to make component controlled
        value = '';
        if (typeof currentValue !== 'undefined' && currentValue !== null) {
          value = currentValue;
        } else if (typeof documentValue !== 'undefined' && documentValue !== null) {
          value = documentValue;
        }
      }
      // replace empty value, which has not been prefilled, by the default value from the schema – for new forms only
      if (isEmptyValue(value) && p.formType === 'new') {
        if (defaultValue) value = defaultValue;
      }
    }

    return this.cleanValue(p, value);
  };

  /*
  
  For some input types apply additional normalization
  
  */
  cleanValue = (props, value) => {
    const p = props || this.props;

    if (p.input === 'checkbox') {
      value = !!value;
    } else if (p.input === 'checkboxgroup') {
      if (!Array.isArray(value)) {
        value = [value];
      }
      // in case of checkbox groups, check "checked" option to populate value
      // if this is a "new document" form
      const checkedValues = _.where(p.options, { checked: true }).map(option => option.value);
      if (checkedValues.length && !value && p.formType === 'new') {
        value = checkedValues;
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

  Note: we use `includes` to get all errors from nested components, which have longer paths

  */
  getErrors = errors => {
    errors = errors || this.props.errors;
    const fieldErrors = errors.filter(error => error.path.includes(this.props.path));
    return fieldErrors;
  };

  /*

  Get form input type, either based on input props, or by guessing based on form field type

  */
  getType = props => {
    const p = props || this.props;
    const fieldType = p.datatype && p.datatype[0].type;
    const autoType =
      fieldType === Number ? 'number' : fieldType === Boolean ? 'checkbox' : fieldType === Date ? 'date' : 'text';
    return p.input || autoType;
  };

  /*
  
  Function passed to form controls to clear their contents (set their value to null)
  
  */
  clearField = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.updateCurrentValues({ [this.props.path]: null });
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(null);
    }
  };

  /*
  
  Function passed to FormComponentInner to help with rendering the component
  
  */
  getFormInput = () => {
    const inputType = this.getType();

    // if input is a React component, use it
    if (typeof this.props.input === 'function') {
      const InputComponent = this.props.input;
      return InputComponent;
    } else {
      // else pick a predefined component

      switch (inputType) {
        case 'text':
          return Components.FormComponentDefault;

        case 'number':
          return Components.FormComponentNumber;

        case 'url':
          return Components.FormComponentUrl;

        case 'email':
          return Components.FormComponentEmail;

        case 'textarea':
          return Components.FormComponentTextarea;

        case 'checkbox':
          return Components.FormComponentCheckbox;

        case 'checkboxgroup':
          return Components.FormComponentCheckboxGroup;

        case 'radiogroup':
          return Components.FormComponentRadioGroup;

        case 'select':
          return Components.FormComponentSelect;

        case 'selectmultiple':
          return Components.FormComponentSelectMultiple;

        case 'datetime':
          return Components.FormComponentDateTime;

        case 'date':
          return Components.FormComponentDate;

        case 'time':
          return Components.FormComponentTime;

        default:
          const CustomComponent = Components[this.props.input];
          return CustomComponent ? CustomComponent : Components.FormComponentDefault;
      }
    }
  };

  render() {
    if (this.props.intlInput) {
      return <Components.FormIntl {...this.props} />;
    } else if (this.props.nestedInput){
      return <Components.FormNested {...this.props} />;
    } 
    return (
      <Components.FormComponentInner
        {...this.props}
        {...this.state}
        inputType={this.getType()}
        value={this.getValue()}
        errors={this.getErrors()}
        document={this.context.getDocument()}
        showCharsRemaining={!!this.showCharsRemaining()}
        onChange={this.handleChange}
        clearField={this.clearField}
        formInput={this.getFormInput()}
      />
    );
  }
}

FormComponent.propTypes = {
  document: PropTypes.object,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  prefilledValue: PropTypes.any,
  options: PropTypes.any,
  input: PropTypes.any,
  datatype: PropTypes.any,
  path: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  nestedSchema: PropTypes.object,
  currentValues: PropTypes.object.isRequired,
  deletedValues: PropTypes.array.isRequired,
  throwError: PropTypes.func.isRequired,
  updateCurrentValues: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  addToDeletedValues: PropTypes.func,
  clearFieldErrors: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

FormComponent.contextTypes = {
  getDocument: PropTypes.func.isRequired,
};

registerComponent('FormComponent', FormComponent);
