import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

const FormNestedItem = ({ nestedFields, name, path, removeItem, itemIndex, ...props }, { errors }) => {
  return (
    <div className="form-nested-item">
      <div className="form-nested-item-inner">
        {nestedFields.map((field, i) => {
          return (
            <Components.FormComponent
              key={i}
              {...props}
              {...field}
              path={`${path}.${field.name}`}
              itemIndex={itemIndex}
            />
          );
        })}
      </div>
      <div className="form-nested-item-remove">
        <Components.Button
          className="form-nested-button"
          variant="danger"
          size="small"
          onClick={() => {
            removeItem(name);
          }}
        >
          <Components.IconRemove height={12} width={12} />
        </Components.Button>
      </div>
      <div className="form-nested-item-deleted-overlay" />
    </div>
  );
};

FormNestedItem.contextTypes = {
  errors: PropTypes.array,
};

registerComponent('FormNestedItem', FormNestedItem);

class FormNested extends PureComponent {
  addItem = () => {
    this.props.updateCurrentValues({ [`${this.props.path}.${this.props.value.length}`]: {} });
  };

  removeItem = index => {
    this.props.updateCurrentValues({ [`${this.props.path}.${index}`]: null });
  };

  /*

  Go through this.context.deletedValues and see if any value matches both the current field
  and the given index (ex: if we want to know if the second address is deleted, we
  look for the presence of 'addresses.1')
  */
  isDeleted = index => {
    return this.context.deletedValues.includes(`${this.props.path}.${index}`);
  };

  render() {
    // do not pass FormNested's own value, input and inputProperties props down
    const properties = _.omit(this.props, 'value', 'input', 'inputProperties');

    return (
      <div className="form-group row form-nested">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          {this.props.value &&
            this.props.value.map(
              (subDocument, i) =>
                !this.isDeleted(i) && (
                  <FormNestedItem
                    {...properties}
                    key={i}
                    itemIndex={i}
                    path={`${this.props.path}.${i}`}
                    removeItem={() => {
                      this.removeItem(i);
                    }}
                  />
                )
            )}
          <Components.Button size="small" variant="success" onClick={this.addItem} className="form-nested-button">
            <Components.IconAdd height={12} width={12} />
          </Components.Button>
        </div>
      </div>
    );
  }
}

FormNested.contextTypes = {
  deletedValues: PropTypes.array,
};

registerComponent('FormNested', FormNested);

const IconAdd = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M448 294.2v-76.4c0-13.3-10.7-24-24-24H286.2V56c0-13.3-10.7-24-24-24h-76.4c-13.3 0-24 10.7-24 24v137.8H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h137.8V456c0 13.3 10.7 24 24 24h76.4c13.3 0 24-10.7 24-24V318.2H424c13.3 0 24-10.7 24-24z" />
  </svg>
);

registerComponent('IconAdd', IconAdd);

const IconRemove = ({ width = 24, height = 24 }) => (
  <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path d="M424 318.2c13.3 0 24-10.7 24-24v-76.4c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.7-24 24v76.4c0 13.3 10.7 24 24 24h400z" />
  </svg>
);

registerComponent('IconRemove', IconRemove);
