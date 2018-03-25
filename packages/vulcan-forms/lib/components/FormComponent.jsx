import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { Components } from 'meteor/vulcan:core';
import { registerComponent } from 'meteor/vulcan:core';
import debounce from 'lodash.debounce';
import get from 'lodash/get';

class FormComponent extends PureComponent {
  constructor(props, context) {
    super(props);

    const value = this.getValue(props, context);

    if (props.limit) {
      this.state = {
        limit: value ? props.limit - value.length : props.limit,
      };
    }
  }

  handleChange = (name, value) => {
    // if this is a number field, convert value before sending it up to Form
    if (this.getType() === 'number') {
      value = Number(value);
    }
    
    this.context.updateCurrentValues({ [this.props.path]: value });

    // for text fields, update character count on change
    if (['number', 'url', 'email', 'textarea', 'text'].includes(this.getType())) {
      this.updateCharacterCount(value);
    }
  };

  /*

  Note: not currently used because when function is debounced
  some changes might not register if the user submits form too soon

  */
  handleChangeDebounced = debounce(this.handleChange, 500, { leading: true });

  updateCharacterCount = (value) => {
    if (this.props.limit) {
      const characterCount = value ? value.length : 0;
      this.setState({
        limit: this.props.limit - characterCount,
      });
    }
  };

  /*

  Get value from Form state through context

  */
  getValue = (props, context) => {
    const p = props || this.props;
    const c = context || this.context;
    return get(c.getDocument(), p.path);
  };

  /*

  Get errors from Form state through context

  */
  getErrors = () => {
    const fieldErrors = this.context.errors.filter(error => error.data.name === this.props.path);
    return fieldErrors;
  };

  /*

  Get form control type, either based on control props, or by guessing
  based on form field type

  */
  getType = () => {
    return this.props.control || 'text';
  };

  renderComponent() {
    // see https://facebook.github.io/react/warnings/unknown-prop.html
    const {
      control,
      group,
      updateCurrentValues,
      document,
      beforeComponent,
      afterComponent,
      limit,
      errors,
      nestedSchema,
      nestedFields,
      datatype,
      parentFieldName,
      itemIndex,
      path,
      ...rest
    } = this.props; // eslint-disable-line

    const properties = {
      ...rest,
      // onBlur: this.handleChange,
      onChange: this.handleChange,
      document,
      value: this.getValue(),
    };

    // if control is a React component, use it
    if (typeof this.props.control === 'function') {
      return <this.props.control {...properties} />;
    } else {
      // else pick a predefined component

      switch (this.getType()) {
        case 'nested':
          return (
            <Components.FormNested
              path={path}
              updateCurrentValues={updateCurrentValues}
              nestedSchema={nestedSchema}
              nestedFields={nestedFields}
              datatype={datatype}
              {...properties}
            />
          );

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
          const CustomComponent = Components[this.props.control];
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
    const fieldName = this.props.name;
    // clear value
    this.context.updateCurrentValues({ [fieldName]: null });
    // add it to unset
    // TODO: not needed anymore?
    // this.context.addToDeletedValues(fieldName);
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
    const hasErrors = this.getErrors() && this.getErrors().length;
    const inputClass = classNames(
      'form-input',
      `input-${this.props.name}`,
      `form-component-${this.props.control || 'default'}`,
      { 'input-error': hasErrors }
    );

    return (
      <div className={inputClass}>
        {this.props.beforeComponent ? this.props.beforeComponent : null}
        {this.renderComponent()}
        {hasErrors ? <Components.FieldErrors errors={this.getErrors()} /> : null}
        {this.showClear() ? this.renderClear() : null}
        {this.props.limit ? (
          <div className={classNames('form-control-limit', { danger: this.state.limit < 10 })}>{this.state.limit}</div>
        ) : null}
        {this.props.afterComponent ? this.props.afterComponent : null}
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
  disabled: PropTypes.bool,
  updateCurrentValues: PropTypes.func,
};

FormComponent.contextTypes = {
  intl: intlShape,
  addToDeletedValues: PropTypes.func,
  errors: PropTypes.array,
  currentValues: PropTypes.object,
  autofilledValues: PropTypes.object,
  deletedValues: PropTypes.array,
  getDocument: PropTypes.func,
  updateCurrentValues: PropTypes.func,
};

registerComponent('FormComponent', FormComponent);
