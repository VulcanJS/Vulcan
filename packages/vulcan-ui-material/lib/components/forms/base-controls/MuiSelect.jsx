import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListSubheader from '@material-ui/core/ListSubheader';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import _isArray from 'lodash/isArray';


export const styles = theme => ({

  inputRoot: {
    '& .clear-enabled': { opacity: 0 },
    '&:hover .clear-enabled': { opacity: 0.54 },
  },

  inputFocused: {
    '& .clear-enabled': { opacity: 0.54 }
  },

  menuItem: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 9,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.87)' : theme.palette.common.white,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: '1.1875em',
  },

  input: {
    paddingLeft: 8,
  },

});


const MuiSelect = createReactClass({

  element: null,

  mixins: [ComponentMixin],

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
    if (this.props.multiple) {
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
    this.props.onChange(value);
  },

  render: function () {
    if (this.props.layout === 'elementOnly') {
      return this.renderElement();
    }

    return (
      <MuiFormControl{...this.getFormControlProperties()} htmlFor={this.getId()}>
        {this.renderElement()}
        <MuiFormHelper {...this.getFormHelperProperties()}/>
      </MuiFormControl>
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
        <MenuItem key={key} {...rest} className={classes.menuItem}>{label}</MenuItem>;
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

    const { options, classes } = this.props;

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
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    value={value}
                    classes={null}
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
                              input: classes.input,
                            }}
              />}
      >
        {optionNodes}
      </Select>
    );
  }
});


export default withStyles(styles)(MuiSelect);
