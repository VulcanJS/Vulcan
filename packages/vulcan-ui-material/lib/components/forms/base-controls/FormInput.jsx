import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { withStyles } from '@material-ui/core/styles';
import ComponentMixin from './mixins/component';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import Input from '@material-ui/core/Input';
import StartAdornment, {hideStartAdornment} from './StartAdornment';
import EndAdornment from './EndAdornment';
import _debounce from 'lodash/debounce';
import classNames from 'classnames';


export const styles = theme => ({

  root: {},

  inputRoot: {
    '& .clear-button.has-value': {opacity: 0},
    '&:hover .clear-button.has-value': {opacity: 0.54},
  },

  inputFocused: {
    '& .clear-button.has-value': {opacity: 0.54},
  },

  inputDisabled: {},

  inputNoLabel: {
    marginTop: '0 !important',
  },

  inputInput: {},

  rootMultiline: {},

  inputMultiline: {},

});


//noinspection JSUnusedGlobalSymbols
const FormInput = createReactClass({
  element: null,

  mixins: [ComponentMixin],

  displayName: 'FormInput',

  propTypes: {
    type: PropTypes.oneOf([
      'color',
      'date',
      'datetime',
      'datetime-local',
      'email',
      'hidden',
      'month',
      'number',
      'password',
      'range',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'social',
      'week',
    ]),
    errors: PropTypes.array,
    placeholder: PropTypes.string,
    formatValue: PropTypes.func,
    scrubValue: PropTypes.func,
    getUrl: PropTypes.func,
    hideClear: PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      type: 'text',
    };
  },

  getInitialState: function () {
    this.handleChangeDebounced = _debounce((value) => {
      if (!this.props.handleChange) return;
      if (value !== this.props.value) {
        this.props.handleChange(value);
      }
    }, 500, { leading: true });

    if (this.props.refFunction) {
      this.props.refFunction(this);
    }

    return {
      value: this.props.value,
    };
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.handleChangeDebounced.cancel();
      this.setState({ value: String(this.props.value) });
    }
  },

  handleInputChange: function (event) {
    let value = event.target.value;
    this.changeValue(value);
  },

  changeValue: function (value) {
    value = String(value);
    if (this.props.scrubValue) {
      value = this.props.scrubValue(value, this.props);
    }
    this.setState({ value });

    this.handleChangeDebounced(value);
  },

  render: function () {
    const startAdornment = hideStartAdornment(this.props) ? null :
        <StartAdornment {...this.props}
                        classes={null}
                        value={this.state.value}
                        changeValue={this.changeValue}
        />;
    const endAdornment =
        <EndAdornment {...this.props}
                      classes={null}
                      value={this.state.value}
                      changeValue={this.changeValue}
        />;

    let element = this.renderElement(startAdornment, endAdornment);

    if (this.props.layout === 'elementOnly' || this.props.type === 'hidden') {
      return element;
    }

    return (
        <FormControlLayout {...this.getFormControlProperties()}
                        htmlFor={this.getId()}>
          {element}
          <FormHelper {...this.getFormHelperProperties()}/>
        </FormControlLayout>
    );
  },

  renderElement: function (startAdornment, endAdornment) {
    const {classes, disabled, autoFocus, formatValue, label, multiline, rows, rowsMax, inputProps} = this.props;
    const value = formatValue ? formatValue(this.state.value) : this.state.value;
    const options = this.props.options || {};

    return (
        <Input
            ref={c => (this.element = c)}
            id={this.getId()}
            value={value || ''}
            label={label}
            onChange={this.handleInputChange}
            disabled={disabled}
            multiline={multiline}
            rows={options.rows || rows}
            rowsMax={options.rowsMax || rowsMax}
            autoFocus={options.autoFocus || autoFocus}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            placeholder={this.props.placeholder}
            classes={{
              root: classNames(classes.inputRoot, label === null && classes.inputNoLabel),
              input: classes.inputInput,
              focused: classes.inputFocused,
              disabled: classes.inputDisabled,
              multiline: classes.rootMultiline,
              inputMultiline: classes.inputMultiline,
            }}
            {...inputProps}
        />
    );
  },


});


export default withStyles(styles)(FormInput);
