// const Formsy = require('formsy-react');
// const FRC = require('formsy-react-components');

import Messages from "meteor/telescope:core";

import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
// import Modal from 'react-modal';

const Checkbox = FRC.Checkbox;
const CheckboxGroup = FRC.CheckboxGroup;
const Input = FRC.Input;
const RadioGroup = FRC.RadioGroup;
const Select = FRC.Select;
const Textarea = FRC.Textarea;

// const customStyles = {
//   content : {
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     transform             : 'translate(-50%, -50%)'
//   }
// };

const UsersEdit = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  submitForm(data) {

    event.preventDefault();

    let modifier = {};
    const user = this.props.document;

    // replace "_" by "." in modifier keys
    _.keys(data).forEach(key => {modifier[key.replace("_", ".")] = data[key]});

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

  renderAdminForm() {
    return (
      <div className="admin-fields">
      </div>
    )
  },

  render() {
  
    const user = this.props.document;

    ({CanEditUser} = Telescope.components);

    return (
      <CanEditUser user={this.props.currentUser} userToEdit={user}>
        <div className="user-edit">
          <h3>Edit Account</h3>
          <Formsy.Form onSubmit={this.submitForm}>
           <Input
              name="telescope_email"
              value={user.telescope.email}
              label="Email"
              type="text"
              className="text-input"
            />
            <Input
              name="telescope_displayName"
              value={user.telescope.displayName}
              label="Display Name"
              type="text"
              className="text-input"
            />
            <Textarea
              name="telescope_bio"
              value={user.telescope.bio}
              label="Bio"
              type="text"
              className="textarea"
            />
            {Users.is.admin(this.props.currentUser) ? this.renderAdminForm() : ""}
            <button type="submit" className="button button--primary">Submit</button>
          </Formsy.Form>
        </div>
      </CanEditUser>
    )
  }
});

module.exports = UsersEdit;