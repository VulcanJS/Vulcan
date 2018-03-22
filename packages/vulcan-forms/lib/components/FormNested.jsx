import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import Button from 'react-bootstrap/lib/Button';

const FormNestedItem = ({ nestedFields, name, subDocument, removeItem, ...props }) => {
  return (
    <div className="form-nested-item">
      <div className="form-nested-item-inner">
        {nestedFields.map((field, i) => {
          const value = subDocument[field.name];
          return <Components.FormComponent key={i} {...props} {...field} value={value} />;
        })}
      </div>
      <div className="form-nested-item-remove">
        <Button
          bsStyle="danger"
          onClick={() => {
            removeItem(name);
          }}
        >
          ✖️
        </Button>
      </div>
    </div>
  );
};

registerComponent('FormNestedItem', FormNestedItem);

class FormNested extends PureComponent {
  addItem = name => {
    alert(`adding ${name}!`);
  };

  removeItem = name => {
    alert(`removing ${name}!`);
  };

  render() {
    return (
      <div className="form-group row form-nested">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          {this.props.value &&
            this.props.value.map((subDocument, i) => (
              <FormNestedItem key={i} itemIndex={i} {...this.props} subDocument={subDocument} removeItem={this.removeItem} />
            ))}
          <Button
            bsStyle="success"
            onClick={() => {
              this.addItem(name);
            }}
          >
            ➕
          </Button>
        </div>
      </div>
    );
  }
}

registerComponent('FormNested', FormNested);
