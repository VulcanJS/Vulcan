import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import get from 'lodash/get';
import merge from 'lodash/merge';
import isEqual from 'lodash/isEqual';
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
  
    const { currentValues, deletedValues, errors } = nextProps;
    const { path } = this.props;
  
    const valueChanged = currentValues[path] !== this.props.currentValues[path];
    const errorChanged = !isEqual(this.getErrors(errors), this.getErrors());
    const deleteChanged = deletedValues.includes(path) !== this.props.deletedValues.includes(path);
    const charsChanged = nextState.charsRemaining !== this.state.charsRemaining;
    
    return valueChanged || errorChanged || deleteChanged || charsChanged;
  }
  
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
    this.props.updateCurrentValues({ [this.props.path]: value });

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
        //value = currentValue || documentValue || '';
        // note: the previous line does not work when a checkbox is 'false' or a number is '0'
        value = currentValue;
        if (typeof value === 'undefined' || value === null) {
          value = documentValue;
        }
        if (typeof value === 'undefined' || value === null) {
          value = '';
        }
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

  render () {
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
