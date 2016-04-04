import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import FormComponent from "./FormComponent.jsx";
import Utils from './utils.js';

class EditDocument extends Component{
  
  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      disabled: false
    };
  }

  getFields() {
    const collection = this.props.collection;
    const fields = collection.getInsertableFields(this.props.currentUser);
    return fields;
  }

  submitForm(data) {
    
    this.setState({disabled: true});

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      this.props.submitCallback();
    }
    
    const fields = this.getFields();
    const document = this.props.document;
    // put all keys with data on $set
    const set = _.compactObject(Utils.flatten(data));
    // put all keys without data on $unset
    const unsetKeys = _.difference(fields, _.keys(set));
    const unset = _.object(unsetKeys, unsetKeys.map(()=>true));
    const modifier = {$set: set, $unset: unset};
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.edit';
    
    Meteor.call(methodName, document._id, modifier, (error, document) => {
      
      this.setState({disabled: false});
      
      if (error) {
        console.log(error)
        if (this.props.errorCallback) {
          this.props.errorCallback(document, error);
        }
      } else {
        if (this.props.successCallback) {
          this.props.successCallback(document);
        }
        if (this.context.closeCallback) {
          this.context.closeCallback();
        }
      }

    });
  }

  render() {

    const document = this.props.document;
    const collection = this.props.collection;
    const fields = this.getFields();

    console.log('called editdocument render')

    const style = {
      maxWidth: "800px",
      width: "100%"
    }

    return (
      <div className="edit-document" style={style}>
        <Formsy.Form onSubmit={this.submitForm} disabled={this.state.disabled}>
          {fields.map(fieldName => <FormComponent 
            key={fieldName}
            className={"input-"+fieldName}
            fieldName={fieldName}
            field={collection.simpleSchema()._schema[fieldName]}
            labelFunction={this.props.labelFunction}
            document={document}
          />)}
          <Button type="submit" bsStyle="primary">Submit</Button>
        </Formsy.Form>
      </div>
    )
  }

}

EditDocument.propTypes = {
  document: React.PropTypes.object.isRequired,
  collection: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object,
  successCallback: React.PropTypes.func,
  errorCallback: React.PropTypes.func,
  methodName: React.PropTypes.string,
  labelFunction: React.PropTypes.func
}

EditDocument.contextTypes = {
  closeCallback: React.PropTypes.func
}

module.exports = EditDocument;
export default EditDocument;