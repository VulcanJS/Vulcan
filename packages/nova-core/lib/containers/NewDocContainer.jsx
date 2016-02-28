import Messages from "../messages.js";
import NovaForms from "../forms.jsx";

import Formsy from 'formsy-react';

const NewDocContainer = React.createClass({

  propTypes: {
    collection: React.PropTypes.object.isRequired,
    label: React.PropTypes.string,
    callback: React.PropTypes.func,
    methodName: React.PropTypes.string
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },

  submitForm(data) {
    // remove any empty properties
    const document = _.compactObject(data); 
    const collection = this.props.collection;
    const methodName = this.props.methodName ? this.props.methodName : collection._name+'.create';

    Meteor.call(methodName, document, (error, document) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Document created.", "success");
        if (this.props.callback) {
          this.props.callback(document);
        }
      }
    });
  },

  render() {
    
    const collection = this.props.collection;
    const fields = collection.getInsertableFields(this.data.currentUser);

    return (
      <div className="new-document">
        <h3>{this.props.label}</h3>
        <Formsy.Form onSubmit={this.submitForm}>
          {fields.map(fieldName => NovaForms.getComponent(fieldName, collection.simpleSchema()._schema[fieldName]))}
          <button type="submit" className="button button--primary">Submit</button>
        </Formsy.Form>
      </div>
    )
  }
});

module.exports = NewDocContainer;