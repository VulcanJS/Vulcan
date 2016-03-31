import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import SmartForms from "./smart-forms.jsx";
import Utils from './utils.js';

const NewDocument = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object,
    errorCallback: React.PropTypes.func,
    successCallback: React.PropTypes.func,
    methodName: React.PropTypes.string,
    labelFunction: React.PropTypes.func
  },

  submitForm(data) {
    
    // remove any empty properties
    const document = _.compactObject(Utils.flatten(data));
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.create';

    Meteor.call(methodName, document, (error, document) => {
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
  },

  render() {
    
    const collection = this.props.collection;
    const fields = collection.getInsertableFields(this.props.currentUser);

    const style = {
      maxWidth: "800px",
      width: "100%"
    }

    return (
      <div className="new-document" style={style}>
        <Formsy.Form onSubmit={this.submitForm}>
          {fields.map(fieldName => <div key={fieldName} className={"input-"+fieldName}>{SmartForms.getComponent(fieldName, collection.simpleSchema()._schema[fieldName], this.props.labelFunction)}</div>)}
          <Button type="submit" bsStyle="primary">Submit</Button>
        </Formsy.Form>
      </div>
    )
  }
});

NewDocument.contextTypes = {
  closeCallback: React.PropTypes.func
}

module.exports = NewDocument;
export default NewDocument;