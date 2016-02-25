import Core from "meteor/nova:core";
({Messages, NovaForms} = Core);

import Formsy from 'formsy-react';

const NewDocumentForm = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    categories: React.PropTypes.array,
    collection: React.PropTypes.object,
    postNewCallback: React.PropTypes.func
  },

  getInitialState() {
    return {
      canSubmit: false
    }
  },
  
  submitForm(data) {
    // remove any empty properties
    document = _.compactObject(data); 

    Meteor.call(this.props.collection._name+'.create', document, (error, result) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Document created.", "success");
        if (this.props.postNewCallback) {
          this.props.postNewCallback(result);
        }
      }
    });
  },

  render() {
    
    const fields = this.props.collection.simpleSchema().getEditableFields(this.props.currentUser);

    return (
      <div className="new-document">
        <h3>New </h3>
        <Formsy.Form onSubmit={this.submitForm}>
          {fields.map(fieldName => NovaForms.getComponent(fieldName, this.props.collection.simpleSchema()._schema[fieldName]))}
          <button type="submit" className="button button--primary">Submit</button>
        </Formsy.Form>
      </div>
    )
  }
});

module.exports = NewDocumentForm;