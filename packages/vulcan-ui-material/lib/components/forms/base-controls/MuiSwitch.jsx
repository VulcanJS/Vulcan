import React from 'react';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';


const MuiSwitch = createReactClass({
  
  mixins: [ComponentMixin],
  
  getDefaultProps: function () {
    return {
      label: '',
      rowLabel: '',
      value: false
    };
  },
  
  changeValue: function (event) {
    const target = event.target;
    const value = target.checked;
    
    //this.setValue(value);
    this.props.onChange(value);
    
    setTimeout(() => {document.activeElement.blur();});
  },
  
  render: function () {
    
    const element = this.renderElement();
    
    if (this.props.layout === 'elementOnly') {
      return element;
    }
    
    return (
      <MuiFormControl {...this.getFormControlProperties()} label={this.props.rowLabel}
        htmlFor={this.getId()}
      >
        {element}
        <MuiFormHelper {...this.getFormHelperProperties()}/>
      </MuiFormControl>
    );
  },
  
  renderElement: function () {
    return (
      <FormControlLabel
        control={
          <Switch
            ref={(c) => this.element = c}
            {...this.cleanSwitchProps(this.cleanProps(this.props))}
            id={this.getId()}
            checked={this.props.value === true}
            onChange={this.changeValue}
            disabled={this.props.disabled}
          />
        }
        label={this.props.label}
      />
    );
  },
  
});


export default MuiSwitch;
