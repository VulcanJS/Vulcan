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
      disabled: false,
      errors: []
    };
  }

  submitForm(data) {
    
    this.setState({disabled: true});

    // if there's a submit callback, run it
    if (this.props.submitCallback) {
      this.props.submitCallback();
    }
    
    // remove any empty properties
    let document = _.compactObject(Utils.flatten(data));
    const collection = this.props.collection;

    // add prefilled properties
    if (this.props.prefilledProps) {
      document = Object.assign(document, this.props.prefilledProps);
    }

    Meteor.call(this.props.methodName, document, (error, document) => {

      this.setState({disabled: false});
      
      if (error) {
        console.log(error)
        this.setState({
          errors: [{
            content: error.message,
            type: "error"
          }]
        });
        if (this.props.errorCallback) {
          this.props.errorCallback(document, error);
        }
      } else {
        this.setState({errors: []});
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

  renderErrors() {
    Flash = Telescope.components.Flash;
    return <div className="form-errors">{this.state.errors.map(message => <Flash message={message}/>)}</div>
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
          {this.renderErrors()}
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