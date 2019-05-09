import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import _omit from 'lodash/omit';


export default {
  
  propTypes: {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    hideLabel: PropTypes.bool,
    layout: PropTypes.string,
    required: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.object),
  },
  
  getFormControlProperties: function () {
    return {
      label: this.props.label,
      hideLabel: this.props.hideLabel,
      layout: this.props.layout,
      required: this.props.required,
      hasErrors: this.hasErrors(),
      className: this.props.className,
      inputType: this.props.inputType,
    };
  },
  
  getFormHelperProperties: function () {
    return {
      help: this.props.help,
      errors: this.props.errors,
      hasErrors: this.hasErrors(),
      showCharsRemaining: this.props.showCharsRemaining,
      charsRemaining: this.props.charsRemaining,
      charsCount: this.props.charsCount,
      max: this.props.max,
    };
  },
  
  hashString: function (string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return hash;
  },
  
  /**
   * The ID is used as an attribute on the form control, and is used to allow
   * associating the label element with the form control.
   *
   * If we don't explicitly pass an `id` prop, we generate one based on the
   * `name`, `label` and `itemIndex` (for nested forms) properties.
   */
  getId: function () {
    const { id, label = '', name, itemIndex = '' } = this.props;
    if (id) {
      return id;
    }
    const cleanName = name ? name.split('[').join('_').replace(']', '') : '';
    return [
      'frc',
      cleanName,
      itemIndex,
      this.hashString(JSON.stringify(label))
    ].join('-');
  },
  
  hasErrors: function () {
    return !!(this.props.errors && this.props.errors.length);
  },
  
  cleanProps: function (props) {
    const removedFields = [
      'arrayField',
      'arrayFieldSchema',
      'beforeComponent',
      'afterComponent',
      'addonAfter',
      'addonBefore',
      'help',
      'label',
      'hideLabel',
      'options',
      'layout',
      'rowLabel',
      'validatePristine',
      'validateOnSubmit',
      'inputClassName',
      'optional',
      'throwError',
      'currentValues',
      'addToDeletedValues',
      'deletedValues',
      'clearFieldErrors',
      'formType',
      'inputType',
      'showCharsRemaining',
      'charsCount',
      'charsRemaining',
      'handleChange',
      'document',
      'updateCurrentValues',
      'classes',
      'errors',
      'description',
      'clearField',
      'regEx',
      'allowedValues',
      'mustComplete',
      'renderComponent',
      'formInput',
      'className',
      'formatValue',
      'scrubValue',
      'custom',
      'hideClear',
      'inputProperties',
      'currentUser',
      'nestedSchema',
      'parentFieldName',
      'itemIndex',
      'formComponents',
      'autoValue',
      'minCount',
      'maxCount',
      'visibleItemIndex'
    ];
    
    return _omit(props, removedFields);
  },
  
  cleanSwitchProps: function (props) {
    const removedFields = [
      'value',
      'error',
    ];
  
    return _omit(props, removedFields);
  },
  
};
