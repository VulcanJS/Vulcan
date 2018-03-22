import React, { PureComponent } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

const FormNestedItem = ({ nestedFields, name, subDocument, ...props}) => {
  
  return (
    <div className="form-nested-item">
      {nestedFields.map((field, i) => {
        const value = subDocument[field.name];
        return <Components.FormComponent key={i} {...field} value={value} />
      })}
    </div>
  )
}

registerComponent('FormNestedItem', FormNestedItem);

class FormNested extends PureComponent{

  addItem = () => {

  }

  removeItem = () => {

  }

  render() {
    
    return (
      <div className="form-group row form-nested">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          {this.props.value && this.props.value.map((subDocument, i) => <FormNestedItem key={i} {...this.props} subDocument={subDocument}/>)}
        </div>
      </div>
    )
  }
}

registerComponent('FormNested', FormNested);