import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import { Button } from 'react-bootstrap';

import FormComponent from "./FormComponent.jsx";
import Utils from './utils.js';

class NewDocument extends Component {

  constructor() {
    super();
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      disabled: false
    };
  }

  submitForm(data) {
    
    this.setState({disabled: true});

    // remove any empty properties
    let document = _.compactObject(Utils.flatten(data));
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.create';

    // add prefilled properties
    if (this.props.prefilledProps) {
      document = Object.assign(document, this.props.prefilledProps);
    }

    Meteor.call(methodName, document, (error, document) => {

      this.setState({disabled: false});
      
      if (error) {
        console.log(error)
        if (this.props.errorCallback) {
          this.props.errorCallback(document, error);
        }
      } else {
        this.refs.newDocumentForm.reset();
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
    
    const collection = this.props.collection;
    const fields = collection.getInsertableFields(this.props.currentUser);

    const style = {
      maxWidth: "800px",
      width: "100%"
    }

    return (
      <div className="new-document" style={style}>
        <Formsy.Form onSubmit={this.submitForm} disabled={this.state.disabled} ref="newDocumentForm">
          {fields.map(fieldName => <FormComponent 
            key={fieldName}
            className={"input-"+fieldName}
            fieldName={fieldName}
            field={collection.simpleSchema()._schema[fieldName]}
            labelFunction={this.props.labelFunction}
          />)}
          <Button type="submit" bsStyle="primary">Submit</Button>
        </Formsy.Form>
      </div>
    )
  }
}

NewDocument.propTypes = {
  collection: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object,
  errorCallback: React.PropTypes.func,
  successCallback: React.PropTypes.func,
  methodName: React.PropTypes.string,
  labelFunction: React.PropTypes.func,
  prefilledProps: React.PropTypes.object
}

NewDocument.contextTypes = {
  closeCallback: React.PropTypes.func
}

module.exports = NewDocument;
export default NewDocument;