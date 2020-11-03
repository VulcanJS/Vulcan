import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import withStyles from '@material-ui/core/styles/withStyles';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import classNames from 'classnames';

const styles = theme => ({
  group: {
    marginTop: '8px',
  },
  inline: {
    flexDirection: 'row',
    '& > label': {
      marginRight: theme.spacing(5),
    },
  },
  twoColumn: {
    display: 'block',

    [theme.breakpoints.down('md')]: {
      '& > label': {
        marginRight: theme.spacing(5),
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '49%',
      },
    },
  },
  threeColumn: {
    display: 'block',

    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing(5),
      },
    },

    [theme.breakpoints.up('sm')]: {
      '& > label': {
        width: '48%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '32%',
      },
    },
  },
  fiveColumn: {
    display: 'block',
    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing(5),
      },
    },
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '38%',
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& > label': {
        width: '32%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '19%',
      },
    },
  },
  eightColumn: {
    display: 'block',

    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '49%',
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& > label': {
        width: '32%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '12%',
      },
    },
  },
  tenColumn: {
    display: 'block',

    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing(1),
      },
    },
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '24%',
      },
    },
    [theme.breakpoints.up('sm')]: {
      '& > label': {
        width: '14%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '9%',
      },
    },
  },
  radio: {
    width: '32px',
    height: '32px',
    marginLeft: '8px',
  },
  line: {
    marginBottom: '12px',
  },
  label: {
    marginBottom: '0px',
  },
  inputDisabled: {},
});

const MuiRadioGroup = createReactClass({
  mixins: [ComponentMixin],

  propTypes: {
    type: PropTypes.oneOf(['inline', 'stacked']),
    inputProperties: PropTypes.shape({
      name: PropTypes.string.isRequired,
      options: PropTypes.array.isRequired,
    }),
  },

  getDefaultProps: function() {
    return {
      type: 'stacked',
      label: '',
      help: null,
      classes: PropTypes.object.isRequired,
    };
  },

  changeRadio: function(event) {
    const value = event.target.value;
    //this.setValue(value);
    this.props.onChange(value);
  },

  validate: function() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    return true;
  },

  renderElement: function() {
    const { options, value, name, disabled: _disabled } = this.props.inputProperties;
    const valueString = String(value);
    const controls = options.map((radio, key) => {
      let checked = valueString === radio.value;
      let disabled = radio.disabled || _disabled;

      return (
        <FormControlLabel
          key={key}
          value={radio.value}
          control={
            <Radio
              className={this.props.classes.radio}
              inputRef={c => (this['element-' + key] = c)}
              checked={checked}
              disabled={disabled}
            />
          }
          className={this.props.classes.line}
          classes={{ label: this.props.classes.label }}
          label={radio.label}
        />
      );
    });

    const maxLength = options.reduce(
      (max, option) => (option.label.length > max ? option.label.length : max),
      0
    );


    const getColumnClass = maxLength => {
      if (maxLength < 3) {
        return 'tenColumn';
      }
      if (maxLength < 7) {
        return 'eightColumn';
      }
      if (maxLength < 12) {
        return 'fiveColumn';
      }
      if (maxLength < 18) {
        return 'threeColumn';
      }
      if (maxLength < 30) {
        return 'twoColumn';
      }
    };

    let columnClass = getColumnClass(maxLength);

    if (this.props.type === 'inline') columnClass = 'inline';

    return (
      <RadioGroup
        aria-label={name}
        name={name}
        className={classNames(this.props.classes.group, this.props.classes[columnClass])}
        value={value}
        onChange={this.changeRadio}>
        {controls}
      </RadioGroup>
    );
  },

  render: function() {
    if (this.props.layout === 'elementOnly') {
      return <div>{this.renderElement()}</div>;
    }

    return (
      <MuiFormControl {...this.getFormControlProperties()} fakeLabel={true}>
        {this.renderElement()}
        <MuiFormHelper {...this.getFormHelperProperties()} />
      </MuiFormControl>
    );
  },
});

export default withStyles(styles)(MuiRadioGroup);
