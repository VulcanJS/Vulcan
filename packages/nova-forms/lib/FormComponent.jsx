import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

import Utils from './utils.js';

const Checkbox = FRC.Checkbox;
// const CheckboxGroup = FRC.CheckboxGroup;
const Input = FRC.Input;
const RadioGroup = FRC.RadioGroup;
const Select = FRC.Select;
const Textarea = FRC.Textarea;

class FormComponent extends Component {

  renderComponent() {

    ({fieldName, field, labelFunction, document} = this.props);

    let options = [];
    if (field.autoform && field.autoform.options) {
      options = typeof field.autoform.options === "function" ? field.autoform.options() : field.autoform.options;
    }

    const value = document && Utils.deepValue(document, fieldName) ? Utils.deepValue(document, fieldName) : "";
    const label = typeof labelFunction === "function" ? labelFunction(fieldName) : fieldName;

    if (typeof field.control === "function") {

      return <field.control key={fieldName} name={fieldName} value={value} label={label}/>

    } else {

      switch (field.control) {
        case "text":
          return <Input         key={fieldName} name={fieldName} value={value} label={label} type="text" />;
        case "textarea":
          return <Textarea      key={fieldName} name={fieldName} value={value} label={label} />;
        case "checkbox":
          return <Checkbox      key={fieldName} name={fieldName} value={value} label={label}/>;        
        // note: checkboxgroup cause React refs error
        case "checkboxgroup":
         return <CheckboxGroup  key={fieldName} name={fieldName} value={value} label={label} options={options} />;
        case "radiogroup":
          return <RadioGroup    key={fieldName} name={fieldName} value={value} label={label} options={options} />;
        case "select":
          return <Select        key={fieldName} name={fieldName} value={value} label={label} options={options} />;
        default: 
          return <Input         key={fieldName} name={fieldName} value={value} label={label} type="text" />;
      }

    }
  }

  render() {
    if (this.props.field.control === "none") {
      return null;
    } else {
      return (
        <div className={"input-"+fieldName}>
          {this.renderComponent()}
        </div>
      )
    }
  }

}

FormComponent.propTypes = {
  fieldName: React.PropTypes.string,
  field: React.PropTypes.object, 
  labelFunction: React.PropTypes.func, 
  document: React.PropTypes.object 
}

export default FormComponent;

//-------------------------------------//

// having the CheckboxGroup component in this file prevents a weird bug

import ComponentMixin from './component';
import Row from './row';

const CheckboxGroup = React.createClass({

    mixins: [Formsy.Mixin, ComponentMixin],

    propTypes: {
        name: React.PropTypes.string.isRequired,
        options: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
        return {
            label: '',
            help: null
        };
    },

    changeCheckbox: function() {
        var value = [];
        this.props.options.forEach(function(option, key) {
            if (this.refs['element-' + key].checked) {
                value.push(option.value);
            }

        }.bind(this));
        this.setValue(value);
        this.props.onChange(this.props.name, value);
    },

    renderElement: function() {
        var _this = this;
        var controls = this.props.options.map(function(checkbox, key) {
            var checked = (_this.getValue().indexOf(checkbox.value) !== -1);
            var disabled = _this.isFormDisabled() || checkbox.disabled || _this.props.disabled;
            return (
                <div className="checkbox" key={key}>
                    <label>
                        <input
                            ref={'element-' + key}
                            checked={checked}
                            type="checkbox"
                            value={checkbox.value}
                            onChange={_this.changeCheckbox}
                            disabled={disabled}
                        /> {checkbox.label}
                    </label>
                </div>
            );
        });
        return controls;
    },

    render: function() {

        if (this.getLayout() === 'elementOnly') {
            return (
                <div>{this.renderElement()}</div>
            );
        }

        return (
            <Row
                {...this.getRowProperties()}
                fakeLabel={true}
            >
                {this.renderElement()}
                {this.renderHelp()}
                {this.renderErrorMessage()}
            </Row>
        );
    }
});
