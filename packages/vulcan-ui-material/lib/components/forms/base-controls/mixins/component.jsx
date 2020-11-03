import React from 'react';
import PropTypes from 'prop-types';
import _omit from 'lodash/omit';


export default {

  propTypes: {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    hideLabel: PropTypes.bool,
    layout: PropTypes.string,
    optional: PropTypes.bool,
    errors: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    inputType: PropTypes.string,
  },

  getFormControlProperties: function () {
    return {
      label: this.props.label,
      hideLabel: this.props.hideLabel,
      layout: this.props.layout,
      optional: this.props.optional,
      value: this.props.value,
      hasErrors: this.hasErrors(),
      className: this.props.className,
      inputType: this.props.inputType,
      required: this.props.required,
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
      className: 'form-helper-text',
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
      'addItem',
      'addonAfter',
      'addonBefore',
      'addToDeletedValues',
      'afterComponent',
      'allowedValues',
      'arrayField',
      'arrayFieldSchema',
      'autoValue',
      'beforeComponent',
      'blackbox',
      'charsCount',
      'charsRemaining',
      'classes',
      'className',
      'clearField',
      'clearFieldErrors',
      'currentUser',
      'currentValues',
      'custom',
      'deletedValues',
      'description',
      'document',
      'errors',
      'formatValue',
      'formComponents',
      'formInput',
      'formType',
      'handleChange',
      'hasErrors',
      'help',
      'hideClear',
      'hideLabel',
      'hideLink',
      'inputClassName',
      'inputProperties',
      'inputType',
      'itemDataType',
      'itemIndex',
      'itemProperties',
      'label',
      'layout',
      'maxCount',
      'minCount',
      'mustComplete',
      'nestedArrayErrors',
      'nestedSchema',
      'optional',
      'options',
      'parentFieldName',
      'prefilledProps',
      'regEx',
      'renderComponent',
      'scrubValue',
      'showCharsRemaining',
      'throwError',
      'updateCurrentValues',
      'validateOnSubmit',
      'validatePristine',
      'visibleItemIndex',
    ];

    return _omit(props, removedFields);
  },

  cleanSwitchProps: function (props) {
    const removedFields = [
      'value',
      'error',
      'label',
    ];

    return _omit(props, removedFields);
  },

};
