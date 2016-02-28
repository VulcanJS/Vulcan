import Core from "meteor/nova:core";
({Messages, NovaForms} = Core);

import Formsy from 'formsy-react';

const UsersEdit = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  submitForm(data) {

    event.preventDefault();

    let modifier = {...data};
    delete modifier.telescope;
    const user = this.props.document;

    // replace "_" by "." in modifier keys
    // _.keys(data).forEach(key => {modifier[key.replace("_", ".")] = data[key]});
    
    // flatten data object
    _.keys(data.telescope).forEach(key => {
      modifier["telescope."+key] = data.telescope[key];
    });

    // remove any empty properties
    modifier = {$set: _.compactObject(modifier)};

    Meteor.call('users.edit', user._id, modifier, (error, user) => {
      if (error) {
        console.log(error);
        Messages.flash(error.message, "error")
        // handle error
      } else {
        Messages.flash("User modified.", "success")
      }
    });
  },

  render() {
  
    const user = this.props.document;

    ({CanEditUser} = Telescope.components);

    const fields = Users.getInsertableFields(this.props.currentUser);

    return (
      <CanEditUser user={this.props.currentUser} userToEdit={user}>
        <div className="user-edit">
          <h3>Edit Account</h3>
          <Formsy.Form onSubmit={this.submitForm}>
            {fields.map(fieldName => NovaForms.getComponent(fieldName, Meteor.users.simpleSchema()._schema[fieldName], this.props.currentUser))}
            <button type="submit" className="button button--primary">Submit</button>
          </Formsy.Form>
        </div>
      </CanEditUser>
    )
  }
});

module.exports = UsersEdit;