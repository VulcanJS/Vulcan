/* eslint-disable react/display-name */

'use strict';

var React = require('react');

module.exports = {

    propTypes: {
        layout: React.PropTypes.string,
        validatePristine: React.PropTypes.bool,
        rowClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        labelClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        elementWrapperClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ])
    },

    contextTypes: {
        layout: React.PropTypes.string,
        validatePristine: React.PropTypes.bool,
        rowClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        labelClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ]),
        elementWrapperClassName: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.object
        ])
    },

    getDefaultProps: function() {
        return {
            disabled: false,
            validatePristine: false,
            onChange: function() {},
            onFocus: function() {},
            onBlur: function() {}
        };
    },

    /**
     * Accessors for "special" properties.
     *
     * The following methods are used to merge master default properties that
     * are optionally set on the parent form. This to to allow customising these
     * properties 'as a whole' for the form, while retaining the ability to
     * override the properties on a component basis.
     *
     * Also see the parent-context mixin.
     */
    getLayout: function() {
        var defaultProperty = this.context.layout || 'horizontal';
        return this.props.layout ? this.props.layout : defaultProperty;
    },

    getValidatePristine: function() {
        var defaultProperty = this.context.validatePristine || false;
        return this.props.validatePristine ? this.props.validatePristine : defaultProperty;
    },

    getRowClassName: function() {
        return [this.context.rowClassName, this.props.rowClassName];
    },

    getLabelClassName: function() {
        return [this.context.labelClassName, this.props.labelClassName];
    },

    getElementWrapperClassName: function() {
        return [this.context.elementWrapperClassName, this.props.elementWrapperClassName];
    },

    getRowProperties: function() {
        return {
            label: this.props.label,
            rowClassName: this.getRowClassName(),
            labelClassName: this.getLabelClassName(),
            elementWrapperClassName: this.getElementWrapperClassName(),
            layout: this.getLayout(),
            required: this.isRequired(),
            hasErrors: this.showErrors()
        };
    },

    hashString: function(string) {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
            hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
    },

    /**
     * getId
     *
     * The ID is used as an attribute on the form control, and is used to allow
     * associating the label element with the form control.
     *
     * If we don't explicitly pass an `id` prop, we generate one based on the
     * `name` and `label` properties.
     */
    getId: function() {
        if (this.props.id) {
            return this.props.id;
        }
        var label = (typeof this.props.label === 'undefined' ? '' : this.props.label);
        return [
            'frc',
            this.props.name.split('[').join('_').replace(']', ''),
            this.hashString(JSON.stringify(label))
        ].join('-');
    },

    renderHelp: function() {
        if (!this.props.help) {
            return '';
        }
        return (
            <span className="help-block">{this.props.help}</span>
        );
    },

    renderErrorMessage: function() {
        if (!this.showErrors()) {
            return '';
        }
        var errorMessages = this.getErrorMessages() || [];
        return errorMessages.map((message, key) => {
            return (
                <span key={key} className="help-block validation-message">{message}</span>
            );
        });
    },

    showErrors: function() {
        if (this.isPristine() === true) {
            if (this.getValidatePristine() === false) {
                return false;
            }
        }
        return (this.isValid() === false);
    }
};
