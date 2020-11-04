import { Components } from 'meteor/vulcan:lib';
import React from 'react';
import createReactClass from 'create-react-class';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
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

  switchRoot: {},

  switchDisabled: {},

});


const SwitchBase = createReactClass({

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

    this.props.handleChange(value);

    setTimeout(() => {document.activeElement.blur();});
  },

  render: function () {
    const startAdornment = hideStartAdornment(this.props) ? null :
      <StartAdornment {...this.props}
                      classes={null}
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    classes={null}
      />;

    const element = this.renderElement(startAdornment, endAdornment);

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

  renderElement: function (startAdornment, endAdornment) {
    const { classes, disabled, value, label } = this.props;

    return (
      <>
        {startAdornment}
        <FormControlLabel
          classes={{
            root: classes.inputRoot,
            disabled: classes.inputDisabled,
          }}
          control={
            <Switch
              classes={{
                root: classes.switchRoot,
                disabled: classes.switchDisabled,
              }}
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
        {endAdornment}
      </>
    );
  },

});


export default withStyles(styles)(SwitchBase);
