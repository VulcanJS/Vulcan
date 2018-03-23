import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import Button from 'react-bootstrap/lib/Button';

const FormNestedItem = ({ isDeleted, nestedFields, name, subDocument, removeItem, ...props }) => {
  return (
    <div className={`form-nested-item ${isDeleted ? 'form-nested-item-deleted' : ''}`}>
      <div className="form-nested-item-inner">
        {nestedFields.map((field, i) => {
          const value = subDocument && subDocument[field.name];
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
      <div className="form-nested-item-deleted-overlay"/>
    </div>
  );
};

registerComponent('FormNestedItem', FormNestedItem);

class FormNested extends PureComponent {

  state = {
    deletedItems : []
  }

  addItem = () => {
    this.props.updateCurrentValues({[`${this.props.name}.${this.props.value.length}`] : {}});
  };

  removeItem = index => {
    this.setState({
      deletedItems: [...this.state.deletedItems, index]
    })
    this.props.updateCurrentValues({[`${this.props.name}.${index}`] : null});
  };

  render() {
    return (
      <div className="form-group row form-nested">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          {this.props.value &&
            this.props.value.map((subDocument, i) => (
              <FormNestedItem key={i} isDeleted={this.state.deletedItems.includes(i)} itemIndex={i} {...this.props} subDocument={subDocument} removeItem={() => {this.removeItem(i)}} />
            ))}
          <Button
            bsStyle="success"
            onClick={this.addItem}
          >
            ➕
          </Button>
        </div>
      </div>
    );
  }
}

registerComponent('FormNested', FormNested);
