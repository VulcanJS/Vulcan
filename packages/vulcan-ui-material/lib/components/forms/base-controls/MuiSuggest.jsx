import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ComponentMixin from './mixins/component';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from '@material-ui/core/Input';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { registerComponent } from 'meteor/vulcan:core';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
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
const styles = theme => {
  const light = theme.palette.type === 'light';
  const bottomLineColor = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)';

  return {
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

    selected: {
      backgroundColor: theme.palette.secondary.light,
    },

    suggestionsList: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },

    inputRoot: {
      '& .clear-enabled': { opacity: 0 },
      '&:hover .clear-enabled': { opacity: 0.54 },
      '&:focus .clear-enabled': { opacity: 0.54 },
    },

    inputFocused: {
      '& .clear-enabled': { opacity: 0.54 },
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
    },

    // From https://github.com/mui-org/material-ui/blob/v3.x/packages/material-ui/src/Input/Input.js
    /* Styles applied to the root element if the component is focused. */
    focused: {},
    /* Styles applied to the root element if `disabled={true}`. */
    disabled: {},
    /* Styles applied to the root element if `error={true}`. */
    error: {},

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
      },
    },

    formattedNoLabel: {
      marginTop: 0,
    },
  };
};

const MuiSuggest = createReactClass({
  inputElement: null,

  mixins: [ComponentMixin],

  propTypes: {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        iconComponent: PropTypes.node,
        formatted: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        onClick: PropTypes.func,
      })
    ),
    classes: PropTypes.object.isRequired,
    limitToList: PropTypes.bool,
    disableText: PropTypes.bool,
    disableSelectOnBlur: PropTypes.bool,
    showAllOptions: PropTypes.bool,
    disableMatchParts: PropTypes.bool,
    className: PropTypes.string,
    autoComplete: PropTypes.string,
    autoFocus: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      autoComplete: 'off',
      autoFocus: false,
    };
  },

  getOptionFormatted: function(option, formattedProps) {
    const formatted =
      option.formatted && typeof option.formatted === 'function'
        ? option.formatted(formattedProps)
        : option.formatted;

    return formatted;
  },

  getOptionLabel: function(option) {
    return option.label || option.value || '';
  },

  getInitialState: function() {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }

    const selectedOption = this.getSelectedOption();
    return {
      inputValue: this.getOptionLabel(selectedOption),
      inputFormatted: this.getOptionFormatted(selectedOption, { current: true }),
      selectedOption: selectedOption,
      suggestions: [],
    };
  },

  UNSAFE_componentWillReceiveProps: function(nextProps) {
    if (nextProps.value !== this.state.value || nextProps.options !== this.props.options) {
      const selectedOption = this.getSelectedOption(nextProps);
      this.setState({
        inputValue: this.getOptionLabel(selectedOption),
        inputFormatted: this.getOptionFormatted(selectedOption, { current: true }),
        selectedOption: selectedOption,
      });
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (
      !_isEqual(nextState, this.state) ||
      nextProps.help !== this.props.help ||
      nextProps.charsCount !== this.props.charsCount ||
      !_isEqual(nextProps.errors, this.props.errors) ||
      nextProps.options !== this.props.options
    );
  },

  getSelectedOption: function(props) {
    props = props || this.props;
    const selectedOption = props.options && props.options.find(opt => opt.value === props.value);
    return selectedOption || { label: '', value: null };
  },

  handleFocus: function(event) {
    if (!this.inputElement) return;

    this.inputElement.select();
  },

  handleBlur: function(event, { highlightedSuggestion: suggestion }) {
    if (suggestion && !this.props.disableSelectOnBlur) {
      this.changeValue(suggestion);
    } else if (this.props.limitToList) {
      const selectedOption = this.getSelectedOption();
      this.setState({
        inputValue: this.getOptionLabel(selectedOption),
        inputFormatted: this.getOptionFormatted(selectedOption, { current: true }),
      });
    }
  },

  highlightFirstSuggestion: function() {
    if (this.props.disableText) return false;

    const selectedOption = this.getSelectedOption();
    if (!selectedOption.value) return true;

    return selectedOption.label !== this.state.inputValue;
  },

  suggestionSelected: function(event, { suggestion }) {
    event.preventDefault();
    this.changeValue(suggestion);
  },

  changeValue: function(suggestion) {
    if (!suggestion) {
      suggestion = { label: '', value: null };
    }
    if (suggestion.onClick) {
      return;
    }
    this.setState({
      selectedOption: suggestion,
      inputValue: this.getOptionLabel(suggestion),
      inputFormatted: this.getOptionFormatted(suggestion, { current: true }),
    });
    this.props.onChange(suggestion.value);
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

  render: function() {
    const { value } = this.props;
    const { inputValue, inputFormatted } = this.state;

    const startAdornment = hideStartAdornment(this.props) ? null : (
      <StartAdornment {...this.props} value={value} classes={null} />
    );
    const endAdornment = (
      <EndAdornment {...this.props} value={value} classes={null} changeValue={this.changeValue} />
    );

    const element = this.renderElement(startAdornment, endAdornment);

    if (this.props.layout === 'elementOnly') {
      return element;
    }

    return (
      <MuiFormControl
        {...this.getFormControlProperties()}
        shrinkLabel={inputFormatted && inputFormatted !== inputValue}
        htmlFor={this.getId()}>
        {element}
        <MuiFormHelper {...this.getFormHelperProperties()} />
      </MuiFormControl>
    );
  },

  renderElement: function(startAdornment, endAdornment) {
    const { classes, autoFocus, disableText, placeholder, inputProperties } = this.props;
    const { inputValue, inputFormatted } = this.state;

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
        onSuggestionHighlighted={this.suggestionHighlighted}
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
      ...rest
    } = inputProps;
    const { hideLabel } = this.props;

    if (formatted && formatted !== value) {
      return (
        <div
          {...rest}
          tabIndex={0}
          className={classNames(
            classes.inputRoot,
            classes.formatted,
            classes.underline,
            hideLabel && classes.formattedNoLabel
          )}>
          {startAdornment}
          {formatted}
          {endAdornment}
        </div>
      );
    }

    /*function FormattedInput (props) {
      const { inputRef, className, ...other } = props;
      
      return (
        <div
          {...other}
          ref={ref => {
            inputRef(ref ? ref.inputElement : null);
          }}
          className={classNames(className, classes.formatted)}
          tabIndex={0}
          onBlur={()=>{console.log("blur")}}
        >
          {formatted}
        </div>
      );
    }
    
    FormattedInput.propTypes = {
      inputRef: PropTypes.func.isRequired,
    };*/

    return (
      <Input
        //inputComponent={formatted && formatted !== value ? FormattedInput : undefined}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        className={classes.textField}
        classes={{ root: classes.inputRoot, focused: classes.inputFocused }}
        value={value}
        inputRef={c => {
          ref(c);
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

  renderSuggestion: function(suggestion, { query, isHighlighted }) {
    const label = this.getOptionFormatted(suggestion) || suggestion.label || suggestion.value || '';
    const matches = match(label, query);
    const parts = parse(label, matches);
    const isSelected = suggestion.value === this.props.value;
    const className = isSelected ? this.props.classes.selected : null;

    return (
      <MenuItem
        selected={isHighlighted}
        component="div"
        className={className}
        onClick={suggestion.onClick}
        data-value={suggestion.value}>
        {suggestion.iconComponent && (
          <div className={this.props.classes.suggestionIcon}>{suggestion.iconComponent}</div>
        )}
        <div>
          {this.props.disableMatchParts
            ? label
            : parts.map((part, index) => {
                return part.highlight ? (
                  <span key={index} style={{ fontWeight: 500 }}>
                    {part.text}
                  </span>
                ) : (
                  <strong key={index} style={{ fontWeight: 300 }}>
                    {part.text}
                  </strong>
                );
              })}
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

export default withStyles(styles)(MuiSuggest);
registerComponent('MuiSuggest', MuiSuggest, [withStyles, styles]);
