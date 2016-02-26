import Messages from "../messages.js";
import NovaForms from "../forms.jsx";

import Formsy from 'formsy-react';

const EditDocContainer = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object, // required but might be passed later on
    collection: React.PropTypes.object, // required but might be passed later on
    label: React.PropTypes.string,
    callback: React.PropTypes.func,
    methodName: React.PropTypes.string
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    console.log(this)

    return {
      currentUser: Meteor.user()
    };
  },

  submitForm(data) {
    const document = this.props.document;
    const modifier = {$set: _.compactObject(data)};
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.edit';
    
    Meteor.call(methodName, document._id, modifier, (error, document) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Document edited.", "success");
        if (this.props.callback) {
          this.props.callback(document);
        }
      }
    });
  },

  render() {

    const document = this.props.document;
    const collection = this.props.collection;
    const fields = collection.simpleSchema().getEditableFields(this.data.currentUser);

    return (
      <div className="document-edit">
        <h3>{this.props.label}</h3>
        <Formsy.Form onSubmit={this.submitForm}>
          {fields.map(fieldName => NovaForms.getComponent(fieldName, collection.simpleSchema()._schema[fieldName], document))}
          <button type="submit" className="button button--primary">Submit</button>
        </Formsy.Form>
      </div>
    )
  }
});

module.exports = EditDocContainer;