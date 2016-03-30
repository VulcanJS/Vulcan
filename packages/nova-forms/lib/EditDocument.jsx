import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import SmartForms from "./smart-forms.jsx";
import Utils from './utils.js';

const EditDocument = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    collection: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object,
    successCallback: React.PropTypes.func,
    errorCallback: React.PropTypes.func,
    methodName: React.PropTypes.string,
    labelFunction: React.PropTypes.func
  },

  submitForm(data) {
    
    console.log(data)

    const document = this.props.document;
    const modifier = {$set: _.compactObject(Utils.flatten(data))};
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.edit';
    
    console.log(modifier)

    Meteor.call(methodName, document._id, modifier, (error, document) => {
      if (error) {
        console.log(error)
        if (this.props.errorCallback) {
          this.props.errorCallback(document);
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
  },

  render() {

    const document = this.props.document;
    const collection = this.props.collection;
    const fields = collection.getInsertableFields(this.props.currentUser);

    const style = {
      maxWidth: "800px",
      width: "100%"
    }

    return (
      <div className="edit-document" style={style}>
        <Formsy.Form onSubmit={this.submitForm}>
          {fields.map(fieldName => <div key={fieldName} className={"input-"+fieldName}>{SmartForms.getComponent(fieldName, collection.simpleSchema()._schema[fieldName], this.props.labelFunction, document)}</div>)}
          <Button type="submit" bsStyle="primary">Submit</Button>
        </Formsy.Form>
      </div>
    )
  }
});

EditDocument.contextTypes = {
  closeCallback: React.PropTypes.func
}

module.exports = EditDocument;
export default EditDocument;