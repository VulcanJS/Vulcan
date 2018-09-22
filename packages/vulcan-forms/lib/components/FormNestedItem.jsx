import React from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent } from 'meteor/vulcan:core';

const FormNestedItem = ({ nestedFields, name, path, removeItem, itemIndex, ...props }, { errors }) => {
  const FormComponents = props.formComponents;
  const isArray = typeof itemIndex !== 'undefined';
  return (
    <div className="form-nested-item">
      <div className="form-nested-item-inner">
        {nestedFields.map((field, i) => {
          return (
            <FormComponents.FormComponent
              key={i}
              {...props}
              {...field}
              path={`${path}.${field.name}`}
              itemIndex={itemIndex}
            />
          );
        })}
      </div>
      {isArray && [
        <div key="remove-button" className="form-nested-item-remove">
          <Components.Button
            className="form-nested-button"
            variant="danger"
            size="small"
            iconButton
            tabIndex="-1"
            onClick={() => {
              removeItem(name);
            }}
          >
            <Components.IconRemove height={12} width={12} />
          </Components.Button>
        </div>,
        <div key="remove-button-overlay" className="form-nested-item-deleted-overlay" />,
      ]}
    </div>
  );
};

FormNestedItem.propTypes = {
  path: PropTypes.string.isRequired,
  itemIndex: PropTypes.number,
};

FormNestedItem.contextTypes = {
  errors: PropTypes.array,
};

registerComponent('FormNestedItem', FormNestedItem);
