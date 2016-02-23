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

const PostEdit = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,
    categories: React.PropTypes.array
  },

  submitForm(data) {
    const post = this.props.document;
    const modifier = {$set: _.compactObject(data)};

    event.preventDefault();

    Meteor.call('posts.edit', post._id, modifier, (error, post) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Post edited.", "success")
        FlowRouter.go('posts.single', post);
      }
    });
  },

  renderAdminForm() {
    const post = this.props.document;
    return (
      <div className="admin-fields">
        <RadioGroup
          name="status"
          value={post.status}
          label="Status"
          options={Posts.config.postStatuses}
        />
        <Checkbox
          name="sticky"
          value={post.sticky}
          label="Sticky"
        />
      </div>
    )
  },

  render() {
     
   ({CanEditPost} = Telescope.components);

    const post = this.props.document;
    const categoriesOptions = this.props.categories.map(category => {
      return {
        value: category._id,
        label: category.name
      }
    });

    return (
      <CanEditPost user={this.props.currentUser} post={post}>
        <div className="post-edit">
          <h3>Edit Post “{post.title}”</h3>
          <Formsy.Form onSubmit={this.submitForm}>
           <Input
              name="url"
              value={post.url}
              label="URL"
              type="text"
              className="text-input"
            />
            <Input
              name="title"
              value={post.title}
              label="Title"
              type="text"
              className="text-input"
            />
            <Textarea
              name="body"
              value={post.body}
              label="Body"
              type="text"
              className="textarea"
            />
            <CheckboxGroup
              name="categories"
              value={post.categories}
              label="Categories"
              type="text"
              options={categoriesOptions}
            />
            {Users.is.admin(this.props.currentUser) ? this.renderAdminForm() : ""}
            <button type="submit" className="button button--primary">Submit</button>
          </Formsy.Form>
        </div>
      </CanEditPost>
    )
  }
});

module.exports = PostEdit;