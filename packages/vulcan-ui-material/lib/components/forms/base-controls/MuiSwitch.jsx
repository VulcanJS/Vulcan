import { Components } from 'meteor/vulcan:lib';
import React from 'react';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';


export const styles = theme => ({
  
  inputRoot: {
    height: 50,
  },
  
  inputFocused: {},
  
  inputDisabled: {},
  
});


const MuiSwitch = createReactClass({
  
  mixins: [ComponentMixin],
  
  getDefaultProps: function () {
    return {
      label: '',
      value: false
    };
  },
  
  changeValue: function (event) {
    const target = event.target;
    const value = target.checked;
    
    this.props.onChange(value);
    
    setTimeout(() => {document.activeElement.blur();});
  },
  
  render: function () {
    
    const element = this.renderElement();
    
    if (this.props.layout === 'elementOnly') {
      return element;
    }
    
    return (
      <MuiFormControl {...this.getFormControlProperties()} hideLabel={true} htmlFor={this.getId()}>
        {element}
        <MuiFormHelper {...this.getFormHelperProperties()}/>
      </MuiFormControl>
    );
  },
  
  renderElement: function () {
    const { classes } = this.props;
    const { disabled, value, label } = this.props.inputProperties;
    
    return (
      <FormControlLabel
        className={classes.inputRoot}
        control={
          <Switch
            ref={(c) => this.element = c}
            {...this.cleanSwitchProps(this.cleanProps(this.props))}
            id={this.getId()}
            checked={value === true}
            onChange={this.changeValue}
            disabled={disabled}
          />
        }
        label={<>{label}<Components.RequiredIndicator optional={this.props.optional} value={value}/></>}
      />
    );
  },
  
});


export default withStyles(styles)(MuiSwitch);
