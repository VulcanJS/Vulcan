import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { withStyles } from '@material-ui/core/styles';
import ComponentMixin from './mixins/component';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import Typography from '@material-ui/core/Typography';

export const styles = theme => ({
  inputRoot: {
    marginTop: theme.spacing(2),
    fontSize: '1.0714285714285714rem',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    cursor: 'not-allowed',
  },
  inputFocused: {},
  inputDisabled: {},
});

//noinspection JSUnusedGlobalSymbols
const FormText = createReactClass({
  element: null,

  mixins: [ComponentMixin],

  displayName: 'FormText',

  propTypes: {},

  getInitialState: function() {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }
    return {};
  },

  parseUrl: function(value) {
    if (!value) return '';
    value = value.toString();

    return value.indexOf('http://') > -1 || value.indexOf('https://') > -1 ? (
      <a href={value} target="_blank" rel="noopener noreferrer">
        {value}
      </a>
    ) : (
      value
    );
  },

  render: function() {
    const { inputProperties, classes, layout } = this.props;
    const variant = inputProperties.variant || 'body2';
    const color = inputProperties.color || 'default';

    let element = (
      <Typography variant={variant} color={color} className={classes.inputRoot}>
        {this.parseUrl(inputProperties.value)}
      </Typography>
    );

    if (layout === 'elementOnly') {
      return element;
    }

    return (
      <FormControlLayout
        {...this.getFormControlProperties()}
        shrinkLabel={true}
        htmlFor={this.getId()}>
        {element}
        <FormHelper {...this.getFormHelperProperties()} />
      </FormControlLayout>
    );
  },
});

export default withStyles(styles)(FormText);
