import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ComponentMixin from './mixins/component';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListSubheader from '@material-ui/core/ListSubheader';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import _isArray from 'lodash/isArray';
import classNames from 'classnames';
import { styles } from './FormSuggest';


const FormSelect = createReactClass({

  element: null,

  mixins: [ComponentMixin],

  propTypes: {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
    classes: PropTypes.object.isRequired,
    showMenuIndicator: PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      showMenuIndicator: true,
    };
  },

  getInitialState: function () {
    return {
      isOpen: false,
    };
  },

  handleOpen: function () {
    // this doesn't work
    this.setState({
      isOpen: true,
    });
  },

  handleClose: function () {
    // this doesn't work
    this.setState({
      isOpen: false,
    });
  },

  handleChange: function (event) {
    const target = event.target;
    let value;
    if (this.props.multiple && this.props.native) {
      value = [];
      for (let i = 0; i < target.length; i++) {
        const option = target.options[i];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else {
      value = target.value;
    }
    this.changeValue(value);
  },

  changeValue: function (value) {
    this.props.handleChange(value);
  },

  render: function () {
    if (this.props.layout === 'elementOnly') {
      return this.renderElement();
    }

    return (
      <FormControlLayout{...this.getFormControlProperties()} htmlFor={this.getId()}>
        {this.renderElement()}
        <FormHelper {...this.getFormHelperProperties()}/>
      </FormControlLayout>
    );
  },

  renderElement: function () {
    const renderOption = (item, key) => {
      //eslint-disable-next-line no-unused-vars
      const { group, label, ...rest } = item;
      return this.props.native
        ?
        <option key={key} {...rest}>{label}</option>
        :
        <MenuItem key={key} {...rest} className={classes.selectItem}>{label}</MenuItem>;
    };

    const renderGroup = (label, key, nodes) => {
      return this.props.native
        ?
        <optgroup label={label} key={key}>
          {nodes}
        </optgroup>
        :
        <MenuList subheader={<ListSubheader component="div">{label}</ListSubheader>} key={key}>
          {nodes}
        </MenuList>;
    };

    const { options = [], classes } = this.props;

    let groups = options.filter(function (item) {
      return item.group;
    }).map(function (item) {
      return item.group;
    });
    // Get the unique items in group.
    groups = [...new Set(groups)];

    let optionNodes = [];

    if (groups.length === 0) {
      optionNodes = options.map(function (item, index) {
        return renderOption(item, index);
      });
    } else {
      // For items without groups.
      const itemsWithoutGroup = options.filter(function (item) {
        return !item.group;
      });

      itemsWithoutGroup.forEach(function (item, index) {
        optionNodes.push(renderOption(item, 'no-group-' + index));
      });

      groups.forEach(function (group, groupIndex) {

        const groupItems = options.filter(function (item) {
          return item.group === group;
        });

        const groupOptionNodes = groupItems.map(function (item, index) {
          return renderOption(item, groupIndex + '-' + index);
        });

        optionNodes.push(renderGroup(group, groupIndex, groupOptionNodes));
      });
    }

    let value = this.props.value;
    if (!this.props.multiple && _isArray(value)) {
      value = value.length ? value[0] : '';
    }

    const startAdornment = hideStartAdornment(this.props) ? null :
      <StartAdornment {...this.props}
                      value={value}
                      classes={null}
                      changeValue={this.changeValue}
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    value={value}
                    classes={{ inputAdornment: classes.inputAdornment }}
                    changeValue={this.changeValue}
      />;

    return (
      <Select className="select"
              ref={(c) => this.element = c}
              {...this.cleanProps(this.props)}
              value={value}
              onChange={this.handleChange}
              onOpen={this.handleOpen}
              onClose={this.handleClose}
              disabled={this.props.disabled}
              input={<Input id={this.getId()}
                            startAdornment={startAdornment}
                            endAdornment={endAdornment}
                            classes={{
                              root: classes.inputRoot,
                              focused: classes.inputFocused,
                              input: classNames(classes.input, !value && classes.inputPlaceholder),
                            }}
              />}
              classes={{ icon: classes.selectIcon }}
      >
        {optionNodes}
      </Select>
    );
  }
});


export default withStyles(styles)(FormSelect);
