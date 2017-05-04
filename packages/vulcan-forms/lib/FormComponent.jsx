import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import { intlShape } from 'react-intl';
import DateTime from './DateTime.jsx';

// import Utils from './utils.js';

const Checkbox = FRC.Checkbox;
const CheckboxGroup = FRC.CheckboxGroup;
const Input = FRC.Input;
const RadioGroup = FRC.RadioGroup;
const Select = FRC.Select;
const Textarea = FRC.Textarea;

class FormComponent extends Component {

  constructor(props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleBlur() {
    // see https://facebook.github.io/react/docs/more-about-refs.html
    if (this.formControl !== null) {
      this.props.updateCurrentValues({[this.props.name]: this.formControl.getValue()});
    }
  }

  renderComponent() {

    // see https://facebook.github.io/react/warnings/unknown-prop.html
    const { control, group, updateCurrentValues, document, beforeComponent, afterComponent, ...rest } = this.props; // eslint-disable-line

    // const base = typeof this.props.control === "function" ? this.props : rest;

    const properties = {
      ...rest,
      onBlur: this.handleBlur,
      ref: (ref) => this.formControl = ref
    };

    // if control is a React component, use it
    if (typeof this.props.control === "function") {

      return <this.props.control {...properties} document={document} />

    } else { // else pick a predefined component

      switch (this.props.control) {
        case "text":
          return <Input         {...properties} type="text" />;
        case "textarea":
          return <Textarea      {...properties} />;
        case "checkbox":
          return <Checkbox      {...properties} />;
        case "checkboxgroup":
          return <CheckboxGroup  {...properties} />;
        case "radiogroup":
          // not sure why, but onChange needs to be specified here
          return <RadioGroup    {...properties} onChange={(name, value) => {this.props.updateCurrentValues({[name]: value})}}/>;
        case "select":
          properties.options = [{label: this.context.intl.formatMessage({id: "forms.select_option"}), disabled: true}, ...properties.options];
          return <Select        {...properties} />;
        case "datetime":
          return <DateTime      {...properties} />;
        default:
          return <Input         {...properties} type="text" />;
      }

    }
  }

  render() {
    return (
      <div className={"input-"+this.props.name}>
        {this.props.beforeComponent ? this.props.beforeComponent : null}
        {this.renderComponent()}
        {this.props.afterComponent ? this.props.afterComponent : null}
      </div>
    )
  }

}

FormComponent.propTypes = {
  document: React.PropTypes.object,
  name: React.PropTypes.string,
  label: React.PropTypes.string,
  value: React.PropTypes.any,
  placeholder: React.PropTypes.string,
  prefilledValue: React.PropTypes.any,
  options: React.PropTypes.any,
  control: React.PropTypes.any,
  datatype: React.PropTypes.any,
  disabled: React.PropTypes.bool,
  updateCurrentValues: React.PropTypes.func
}

FormComponent.contextTypes = {
  intl: intlShape
};

export default FormComponent;
