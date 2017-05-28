/*jshint node:true */

'use strict';

var React = require('react');
import PropTypes from 'prop-types';
var classNames = require('classnames/dedupe');

var Row = React.createClass({

    propTypes: {
        label: PropTypes.node,
        rowClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        labelClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        elementWrapperClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        required: PropTypes.bool,
        hasErrors: PropTypes.bool,
        fakeLabel: PropTypes.bool,
        layout: PropTypes.oneOf(['horizontal', 'vertical', 'elementOnly']),
        htmlFor: PropTypes.string
    },

    getDefaultProps: function() {
        return {
            label: '',
            rowClassName: '',
            labelClassName: '',
            elementWrapperClassName: '',
            required: false,
            hasErrors: false,
            fakeLabel: false
        };
    },

    renderLabel: function() {

        if (this.props.layout === 'elementOnly') {
            return '';
        }

        var labelClassNames = [];
        labelClassNames.push('control-label');

        if (this.props.layout === 'horizontal') {
            labelClassNames.push('col-sm-3');
        }

        labelClassNames.push(this.props.labelClassName);

        if (this.props.fakeLabel) {
            return (
                <div className={classNames(labelClassNames)}>
                    <strong>
                        {this.props.label}
                        {this.props.required ? ' *' : null}
                    </strong>
                </div>
            );
        }
        return (
            <label className={classNames(labelClassNames)} htmlFor={this.props.htmlFor}>
                {this.props.label}
                {this.props.required ? ' *' : null}
            </label>
        );
    },

    render: function() {

        if (this.props.layout === 'elementOnly') {
            return (
                <span>
                {this.props.children}
                </span>
            );
        }

        var cssClasses = {
            row: ['form-group'],
            elementWrapper: []
        };

        if (this.props.hasErrors) {
            cssClasses.row.push('has-error');
            cssClasses.row.push('has-feedback');
        }

        var element = this.props.children;
        if (this.props.layout === 'horizontal') {

            // Horizontal layout needs a 'row' class for Bootstrap 4
            cssClasses.row.push('row');

            cssClasses.elementWrapper.push('col-sm-9');
            cssClasses.elementWrapper.push(this.props.elementWrapperClassName);

            element = (
                <div className={classNames(cssClasses.elementWrapper)}>
                    {this.props.children}
                </div>
            );
        }

        cssClasses.row.push(this.props.rowClassName);
        return (
            <div className={classNames(cssClasses.row)}>
                {this.renderLabel()}
                {element}
            </div>
        );
    }

});

module.exports = Row;
