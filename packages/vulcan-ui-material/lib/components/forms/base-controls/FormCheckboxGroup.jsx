import React, { useState } from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import { Components } from 'meteor/vulcan:core';
import without from 'lodash/without';
import uniq from 'lodash/uniq';

const styles = theme => ({
  group: {
    marginTop: '8px',
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
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '49%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '32%',
      },
    },
  },
});

// this marker is used to identify "other" values
export const otherMarker = '[other]';

// check if a string is an "other" value
export const isOtherValue = s => s && typeof s === 'string' && s.substr(0, otherMarker.length) === otherMarker;

// remove the "other" marker from a string
export const removeOtherMarker = s => s && typeof s === 'string' && s.substr(otherMarker.length);

// add the "other" marker to a string
export const addOtherMarker = s => `${otherMarker}${s}`;

// return array of values without the "other" value
export const removeOtherValue = a => {
  return a.filter(s => !isOtherValue(s));
};

const OtherComponent = ({ value: _values, path, updateCurrentValues }) => {
  const otherValue = removeOtherMarker(_values.find(isOtherValue));
  // get copy of checkbox group values with "other" value removed
  const withoutOtherValue = removeOtherValue(_values);

  // keep track of whether "other" field is shown or not
  const [showOther, setShowOther] = useState(!!otherValue);

  // keep track of "other" field value locally
  const [textFieldValue, setTextFieldValue] = useState(otherValue);

  // textfield properties
  const textFieldInputProperties = {
    value: textFieldValue,
    onChange: fieldValue => {
      // first, update local state
      setTextFieldValue(fieldValue);
      // then update global form state
      const newValue = isEmpty(fieldValue) ? withoutOtherValue : [...withoutOtherValue, addOtherMarker(fieldValue)];
      updateCurrentValues({ [path]: newValue });
    },
  };

  const textFieldItemProperties = {layout: 'elementOnly'};

  return (
    <div className="form-option-other">
      <FormControlLabel
        control={
          <Checkbox
            inputRef={c => (this[name + '-' + 'other'] = c)}
            checked={showOther}
            onChange={event => {
              const isChecked = event.target.checked;
              setShowOther(isChecked);
              if (isChecked) {
                // if checkbox is checked and textfield has value, update global form state with current textfield value
                if (textFieldValue) {
                  updateCurrentValues({ [path]: [...withoutOtherValue, addOtherMarker(textFieldValue)] });
                }
              } else {
                // if checkbox is unchecked, also clear out field value from global form state
                updateCurrentValues({ [path]: withoutOtherValue });
              }
            }}
            value={'other'}
          />
        }
        label={'Other'}
      />
      {showOther && <Components.FormComponentText itemProperties={textFieldItemProperties}
                                                  value={textFieldInputProperties.value}
                                                  handleChange={textFieldInputProperties.onChange}/>}
    </div>
  );
};

const FormCheckboxGroup = createReactClass({
  mixins: [ComponentMixin],

  propTypes: {
    classes: PropTypes.object.isRequired,
    inputProperties: PropTypes.shape({
      variant: PropTypes.oneOf(['checkbox', 'switch']),
      name: PropTypes.string,
      options: PropTypes.array.isRequired,
      columnClass: PropTypes.oneOf(['twoColumn', 'threeColumn']),
    }).isRequired,
  },

  componentDidMount: function () {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }
  },

  getDefaultProps: function () {
    return {
      label: '',
      help: null,
    };
  },

  validate: function () {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    return true;
  },

  renderElement: function () {
    const {name, options, disabled: _disabled} = this.props.inputProperties;
    let {value: _values} = this.props.inputProperties;
    const {itemProperties, updateCurrentValues, value, path} = this.props;

    // get rid of duplicate values; or any values that are not included in the options provided
    // (unless they have the "other" marker)
    _values = _values ? uniq(value.filter(v => isOtherValue(v) || options.map(o => o.value).includes(v))) : [];
    const controls = options.map((checkbox, key) => {
      let checkboxValue = checkbox.value;
      let checked = _values.indexOf(checkboxValue) !== -1;
      let disabled = checkbox.disabled || _disabled;
      const Component = this.props.variant === 'switch' ? Switch : Checkbox;

      return (
        <FormControlLabel
          key={key}
          control={
            <Component
              inputRef={c => (this[name + '-' + checkboxValue] = c)}
              checked={checked}
              onChange={event => {
                const isChecked = event.target.checked;
                const newValue = isChecked ? [..._values, checkbox.value] : without(_values, checkbox.value);
                updateCurrentValues({ [path]: newValue });
              }}
              value={checkboxValue}
              disabled={disabled}
            />
          }
          label={checkbox.label}
        />
      );
    });

    const maxLength = options.reduce(
      (max, option) => (option.label.length > max ? option.label.length : max),
      0,
    );

    const columnClass = this.props.inputProperties.columnClass ||
      (maxLength < 20 ? 'threeColumn' : maxLength < 30 ? 'twoColumn' : '');

    return (
      <FormGroup className={classNames(this.props.classes.group, this.props.classes[columnClass])}>
        {controls}
        {itemProperties.showOther && <OtherComponent value={_values} path={path} updateCurrentValues={updateCurrentValues}/>}
      </FormGroup>
    );
  },

  render: function () {
    if (this.props.layout === 'elementOnly') {
      return <div>{this.renderElement()}</div>;
    }

    return (
      <FormControlLayout {...this.getFormControlProperties()} fakeLabel={true}>
        {this.renderElement()}
        <FormHelper {...this.getFormHelperProperties()} />
      </FormControlLayout>
    );
  },
});

export default withStyles(styles)(FormCheckboxGroup);
