import { Components } from 'meteor/vulcan:lib';
import React from 'react';
import createReactClass from 'create-react-class';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import ComponentMixin from './mixins/component';
import { withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';


export const styles = theme => ({

  inputRoot: {
    height: 50,
  },

  inputFocused: {},

  inputDisabled: {},

  checkboxRoot: {},

  checkboxDisabled: {},

});


const FormCheckbox = createReactClass({

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
      <FormControlLayout {...this.getFormControlProperties()} hideLabel={true} htmlFor={this.getId()}>
        {element}
        <FormHelper {...this.getFormHelperProperties()}/>
      </FormControlLayout>
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
          <Checkbox
            ref={(c) => this.element = c}
            {...this.cleanSwitchProps(this.cleanProps(this.props))}
            id={this.getId()}
            checked={value === true}
            onChange={this.changeValue}
            disabled={disabled}
            classes={{
              root: classes.checkboxRoot,
              disabled: classes.checkboxDisabled,
            }}
          />
        }
        label={<>{label}<Components.RequiredIndicator optional={this.props.optional} value={value}/></>}
      />
        {endAdornment}
      </>
    );
  },

});


export default withStyles(styles)(FormCheckbox);
