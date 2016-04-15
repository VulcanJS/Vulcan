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

    // if control is a React component, use it
    if (typeof this.props.control === "function") {

      return <this.props.control {...this.props} />

    } else { // else pick a predefined component

      switch (this.props.control) {
        case "text":
          return <Input         {...this.props} type="text" />;
        case "textarea":
          return <Textarea      {...this.props} />;
        case "checkbox":
          return <Checkbox      {...this.props} />;        
        // note: checkboxgroup cause React refs error
        case "checkboxgroup":
         return <CheckboxGroup  {...this.props} />;
        case "radiogroup":
          return <RadioGroup    {...this.props} />;
        case "select":
          return <Select        {...this.props} />;
        default: 
          return <Input         {...this.props} type="text" />;
      }

    }
  }

  render() {
    return <div className={"input-"+this.props.name}>{this.renderComponent()}</div>
  }

}

FormComponent.propTypes = {
  name: React.PropTypes.string,
  label: React.PropTypes.string, 
  value: React.PropTypes.any, 
  options: React.PropTypes.any,
  control: React.PropTypes.any
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
