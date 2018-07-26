import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';
import "./FormNestedItem"

class FormNestedObject extends PureComponent {
    /*getCurrentValue() {
        return this.props.currentValues[this.props.path] || {}
    }*/
    render() {
        //const value = this.getCurrentValue()
        // do not pass FormNested's own value, input and inputProperties props down
        const properties = _.omit(this.props, 'value', 'input', 'inputProperties', 'nestedInput');
        return (
            <div className="form-group row form-nested">
                <label className="control-label col-sm-3">{this.props.label}</label>
                <div className="col-sm-9">
                    <Components.FormNestedItem
                        {...properties}
                        path={`${this.props.path}`}
                    />
                </div>
            </div>
        );
    }
}

FormNestedObject.propTypes = {
    currentValues: PropTypes.object,
    path: PropTypes.string,
    label: PropTypes.string
};

module.exports = FormNestedObject

registerComponent('FormNestedObject', FormNestedObject);

