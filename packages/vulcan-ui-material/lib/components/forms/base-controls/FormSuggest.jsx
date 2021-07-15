import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { registerComponent } from 'meteor/vulcan:core';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import _isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import IsolatedScroll from 'react-isolated-scroll';

const maxSuggestions = 100;

/*{
  container:                'react-autosuggest__container',
  containerOpen:            'react-autosuggest__container--open',
  input:                    'react-autosuggest__input',
  inputOpen:                'react-autosuggest__input--open',
  inputFocused:             'react-autosuggest__input--focused',
  suggestionsContainer:     'react-autosuggest__suggestions-container',
  suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
  suggestionsList:          'react-autosuggest__suggestions-list',
  suggestion:               'react-autosuggest__suggestion',
  suggestionFirst:          'react-autosuggest__suggestion--first',
  suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
  sectionContainer:         'react-autosuggest__section-container',
  sectionContainerFirst:    'react-autosuggest__section-container--first',
  sectionTitle:             'react-autosuggest__section-title'
}*/
export const styles = theme => {
  const light = theme.palette.type === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';

  return {

    root: {},

    container: {
      flexGrow: 1,
      position: 'relative',
    },

    textField: {
      width: '100%',
      'label + div > &': {
        marginTop: theme.spacing(2),
      },
    },

    input: {
      outline: 0,
      font: 'inherit',
      color: 'currentColor',
      width: '100%',
      border: '0',
      margin: '0',
      padding: '7px 0',
      display: 'block',
      boxSizing: 'content-box',
      background: 'none',
      verticalAlign: 'middle',
      '&::-webkit-search-decoration, &::-webkit-search-cancel-button, &::after, &:after': {
        display: 'none',
      },
      '&::-webkit-search-results, &::-webkit-search-results-decoration': { display: 'none' },
    },

    inputPlaceholder: {
      color: theme.palette.common.lightBlack,
    },

    readOnly: {
      cursor: 'pointer',
    },

    suggestionsContainer: {
      display: 'none',
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: theme.zIndex.modal,
      marginBottom: theme.spacing(3),
      maxHeight: 48 * 8,
    },

    suggestionsContainerOpen: {
      display: 'flex',
    },

    scroller: {
      flexGrow: 1,
      overflowY: 'auto',
    },

    suggestion: {
      display: 'block',
    },

    suggestionIcon: {
      marginRight: theme.spacing(2),
    },

    current: {
      backgroundColor: theme.palette.secondary.light,
    },

    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },

    inputRoot: {
      '&:hover .clear-button.has-value': { opacity: 0.54, pointerEvents: 'initial' },
      '&:focus .clear-button.has-value': { opacity: 0.54, pointerEvents: 'initial' },
      '&:hover .menu-indicator.has-value': { opacity: 0 },
      '&:focus .menu-indicator.has-value': { opacity: 0 },
    },

    inputFocused: {
      '& .clear-button.has-value': { opacity: 0.54, pointerEvents: 'initial' },
      '& .menu-indicator.has-value': { opacity: 0 },
    },

    inputDisabled: {},

    formatted: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 4,
      paddingRight: 0,
      paddingBottom: 4,
      paddingLeft: 0,
      fontSize: 17.15,
      cursor: 'pointer',
      '&$disabled': {
        pointerEvents: 'none',
      },
    },

    error: {},

    disabled: {},

    focused: {},

    underline: {
      '&:after': {
        borderBottom: `2px solid ${theme.palette.primary[light ? 'dark' : 'light']}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
        content: '""',
        position: 'absolute',
        right: 0,
        transform: 'scaleX(0)',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shorter,
          easing: theme.transitions.easing.easeOut,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      '&:focus:after': {
        transform: 'scaleX(1)',
      },
      '&$error:after': {
        borderBottomColor: theme.palette.error.main,
        transform: 'scaleX(1)', // error is always underlined in red
      },
      '&:before': {
        borderBottom: `1px solid ${bottomLineColor}`,
        left: 0,
        bottom: 0,
        // Doing the other way around crash on IE 11 "''" https://github.com/cssinjs/jss/issues/242
        content: '"\\00a0"',
        position: 'absolute',
        right: 0,
        transition: theme.transitions.create('border-bottom-color', {
          duration: theme.transitions.duration.shorter,
        }),
        pointerEvents: 'none', // Transparent to the hover style.
      },
      '&:hover:not($disabled):not($focused):not($error):before': {
        borderBottom: `2px solid ${theme.palette.text.primary}`,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          borderBottom: `1px solid ${bottomLineColor}`,
        },
      },
      '&$disabled:before': {
        borderBottomStyle: 'dotted',
        '@media print': {
          borderBottomStyle: 'solid',
          borderBottomWidth: 'thin',
        },
      },
    },

    formattedNoLabel: {
      marginTop: 0,
    },

    selectItem: {
      paddingTop: 4,
      paddingBottom: 4,
      paddingLeft: 9,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.87)' : theme.palette.common.white,
      fontSize: theme.typography.pxToRem(16),
      lineHeight: '1.1875em',
    },

    selectIcon: {
      display: 'none',
    },

    inputAdornment: {
      pointerEvents: 'none',
    },

    menuItem: {},

    menuItemHighlight: {},

    menuItemIcon: {},

  };
};

const FormSuggest = createReactClass({
  inputElement: null,

  mixins: [ComponentMixin],

  propTypes: {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        iconComponent: PropTypes.node,
        formatted: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
        onClick: PropTypes.func,
      }),
    ),
    classes: PropTypes.object.isRequired,
    limitToList: PropTypes.bool,
    disableText: PropTypes.bool,
    disableSelectOnBlur: PropTypes.bool,
    showAllOptions: PropTypes.bool,
    disableMatchParts: PropTypes.bool,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
    showMenuIndicator: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      autoComplete: 'off',
      autoFocus: false,
      showMenuIndicator: true,
    };
  },

  getOptionFormatted: function(option, formattedProps) {
    if (!option) return;
    const formatted =
      option.formatted && typeof option.formatted === 'function'
        ? option.formatted(formattedProps)
        : option.formatted;
    return formatted;
  },

  getOptionLabel: function(option) {
    return option && option.label || option && option.value || '';
  },

  getInitialState: function() {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }

    const inputValue = this.getInputValue(this.props);
    return {
      inputValue,
      suggestions: [],
    };
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    if (nextProps.value !== this.props.value ||
      nextProps.options !== this.props.options) {
      const inputValue = this.getInputValue(nextProps);
      this.setState({
        inputValue,
      });
    }
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    const shouldUpdate = !_isEqual(nextState, this.state) ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.help !== this.props.help ||
      nextProps.charsCount !== this.props.charsCount ||
      !_isEqual(nextProps.errors, this.props.errors) ||
      nextProps.options !== this.props.options;
    return shouldUpdate;
  },

  getInputValue: function (props) {
    const selectedOption = this.getSelectedOption(props);
    const inputValue = selectedOption ?
      this.getOptionLabel(selectedOption) :
      props.limitToList ?
        '' :
        props.value;
    return inputValue;
  },

  getSelectedOption: function(props) {
    props = props || this.props;
    const selectedOption = props.options && props.options.find(opt => opt.value === props.value);
    return selectedOption;
  },

  handleFocus: function(event) {
    if (!this.inputElement) return;

    this.inputElement.select();
  },

  handleBlur: function(event, { highlightedSuggestion: suggestion }) {
    if (!this.props.disableSelectOnBlur) {
      const selectedOption = this.getSelectedOption();
      if (!selectedOption) return;

      this.changeValue(selectedOption);
      const inputValue = this.getInputValue(this.props);
      this.setState({
        inputValue,
      });
    }
  },

  highlightFirstSuggestion: function() {
    if (this.props.disableText) return false;

    const selectedOption = this.getSelectedOption();
    if (!selectedOption || !selectedOption.value) return true;
    return selectedOption.label !== this.state.inputValue;
  },

  suggestionSelected: function(event, { suggestion }) {
    event.preventDefault();
    this.changeValue(suggestion);
  },

  changeValue: function(suggestion) {
    if (!suggestion) {
      suggestion = this.props.limitToList || suggestion === null ?
        { label: '', value: null } :
        { label: this.state.inputValue, value: this.state.inputValue };
    }
    if (suggestion.onClick) {
      return;
    }
    this.setState({
      inputValue: this.getOptionLabel(suggestion),
    });
    this.props.handleChange(suggestion.value);
  },

  handleInputChange: function(event) {
    const value = event.target.value;
    this.setState({
      inputValue: value,
    });
  },

  handleSuggestionsFetchRequested: function({ value, reason }) {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  },

  handleSuggestionsClearRequested: function() {
    this.setState({
      suggestions: [],
    });
  },

  shouldRenderSuggestions: function(value) {
    return true;
  },

  render: function () {
    const { value, disabled, classes } = this.props;
    const { inputValue } = this.state;
    const selectedOption = this.getSelectedOption();
    const inputFormatted = this.getOptionFormatted(selectedOption, {
      current: true,
      disabled,
    });

    const startAdornment = hideStartAdornment(this.props) ? null :
      <StartAdornment {...this.props}
                      value={value}
                      classes={null}
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    value={value}
                    classes={{ inputAdornment: classes.inputAdornment }}
                    changeValue={this.changeValue}
      />;

    const element = this.renderElement(startAdornment, endAdornment);

    if (this.props.layout === 'elementOnly') {
      return element;
    }

    return (
      <FormControlLayout
        {...this.getFormControlProperties()}
        shrinkLabel={inputFormatted && inputFormatted !== inputValue}
        htmlFor={this.getId()}>
        {element}
        <FormHelper {...this.getFormHelperProperties()} />
      </FormControlLayout>
    );
  },

  renderElement: function(startAdornment, endAdornment) {
    const { classes, autoFocus, disableText, placeholder, inputProperties, disabled } = this.props;
    const { inputValue } = this.state;
    const selectedOption = this.getSelectedOption();
    const inputFormatted = this.getOptionFormatted(selectedOption, {
      current: true,
      disabled,
    });
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          input: classNames(classes.input, disableText && classes.readOnly),
          suggestionsContainer: classes.suggestionsContainer,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestion: classes.suggestion,
          suggestionsList: classes.suggestionsList,
        }}
        highlightFirstSuggestion={this.highlightFirstSuggestion()}
        renderInputComponent={this.renderInputComponent}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        focusInputOnSuggestionClick={false}
        alwaysRenderSuggestions={false}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        onSuggestionSelected={this.suggestionSelected}
        inputProps={{
          ...this.cleanProps(inputProperties),
          autoFocus,
          classes,
          onChange: this.handleInputChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
          value: inputValue,
          formatted: inputFormatted,
          placeholder: placeholder,
          readOnly: disableText,
          disabled: this.props.disabled,
          name: this.props.name,
          'aria-haspopup': 'true',
          startAdornment,
          endAdornment,
        }}
      />
    );
  },

  renderInputComponent: function(inputProps) {
    const {
      classes,
      autoFocus,
      autoComplete,
      value,
      formatted,
      ref,
      startAdornment,
      endAdornment,
      disabled,
      errors,
      ...rest
    } = inputProps;
    const { hideLabel, inputRef } = this.props;

    if (formatted && formatted !== value) {
      return (
        <div
          aria-readonly={disabled}
          {...rest}
          tabIndex={0}
          className={classNames(
            classes.inputRoot,
            classes.underline,
            disabled && classes.disabled,
            errors?.length && classes.error,
            classes.formatted,
            hideLabel && classes.formattedNoLabel,
          )}>
          {startAdornment}
          {formatted}
          {endAdornment}
        </div>
      );
    }

    return (
      <Input
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        className={classes.textField}
        classes={{
          root: classes.inputRoot,
          underline: classes.underline,
          focused: classes.inputFocused,
        }}
        value={value}
        inputRef={c => {
          ref(c);
          if (inputRef) {
            inputRef(c);
          }
          this.inputElement = c;
        }}
        type="text"
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        disabled={disabled}
        inputProps={{
          ...rest,
        }}
      />
    );
  },

  renderSuggestion: function (suggestion, { query, isHighlighted }) {
    const { classes } = this.props;
    const formatted = this.getOptionFormatted(suggestion, {
      disabled: this.props.disabled,
      selected: isHighlighted,
    });
    if (formatted) return formatted;

    const label = suggestion.label || suggestion.value || '';
    const matches = match(label, query);
    const parts = parse(label, matches);
    const primary = this.props.disableMatchParts
      ?
      label
      :
      parts.map((part, index) => {
        return part.highlight
          ?
          <span key={index} className={classes.menuItemHighlight}>{part.text}</span>
          :
          <span key={index}>{part.text}</span>;
      });
    const isCurrent = suggestion.value === this.props.value;
    const className = classNames(classes.menuItem, isCurrent && classes.current);
    return (
      <MenuItem selected={isHighlighted}
                component="div"
                className={className}
                onClick={suggestion.onClick}
                data-value={suggestion.value}
      >
        {
          suggestion.iconComponent &&
          <ListItemIcon classes={{ root: classes.menuItemIcon }}>{suggestion.iconComponent}</ListItemIcon>
        }
        <div>
          {primary}
        </div>
      </MenuItem>
    );
  },

  renderSuggestionsContainer: function({ containerProps, children }) {
    const { classes } = this.props;

    return (
      <Paper {...containerProps} id={`menu-${this.props.name}`} square>
        <IsolatedScroll className={classes.scroller}>{children}</IsolatedScroll>
      </Paper>
    );
  },

  getSuggestionValue: function(suggestion) {
    return suggestion.value;
  },

  getSuggestions: function(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    const inputMatchesSelection = value === this.getOptionLabel(this.getSelectedOption());

    return (this.props.disableText || this.props.showAllOptions) && inputMatchesSelection
      ? this.props.options.filter(suggestion => {
        return true;
      })
      : inputLength === 0
        ? this.props.options.filter(suggestion => {
          count++;
          return count <= maxSuggestions;
        })
        : this.props.options.filter(suggestion => {
          const label = this.getOptionLabel(suggestion);
          const keep = count < maxSuggestions && label.toLowerCase().includes(inputValue);

          if (keep) {
            count++;
          }

          return keep;
        });
  },

});

export default withStyles(styles)(FormSuggest);
registerComponent('FormSuggest', FormSuggest, [withStyles, styles]);
