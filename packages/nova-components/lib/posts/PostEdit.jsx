// const Formsy = require('formsy-react');
// const FRC = require('formsy-react-components');

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
  
  submitForm(data) {
    event.preventDefault();
    const modifier = {$set: _.compactObject(data)};
    console.log(modifier)
    Meteor.call('posts.edit', modifier, this.props.post._id, (error, post) => {
      if (error) {
        // handle error
      } else {
        FlowRouter.go('posts.single', post);
      }
    });
  },

  renderAdminForm() {
    return (
      <div className="admin-fields">
        <RadioGroup
          name="status"
          value={this.props.post.status}
          label="Status"
          options={Posts.config.postStatuses}
        />
        <Checkbox
          name="sticky"
          value={this.props.post.sticky}
          label="Sticky"
        />
      </div>
    )
  },

  render() {
     
    const categoriesOptions = this.props.categories.map(category => {
      return {
        value: category._id,
        label: category.name
      }
    });

    return (
      <div className="post-edit">
        <h3>Edit Post “{this.props.post.title}”</h3>
        <Formsy.Form onSubmit={this.submitForm}>
         <Input
            name="url"
            value={this.props.post.url}
            label="URL"
            type="text"
            className="text-input"
          />
          <Input
            name="title"
            value={this.props.post.title}
            label="Title"
            type="text"
            className="text-input"
          />
          <Textarea
            name="body"
            value={this.props.post.body}
            label="Body"
            type="text"
            className="textarea"
          />
          {/*
          <CheckboxGroup
            name="categories"
            value=""
            label="Categories"
            type="text"
            options={categoriesOptions}
          />
          */}
          {Users.is.admin(this.props.currentUser) ? this.renderAdminForm() : ""}
          <button type="submit" className="button button--primary">Submit</button>
        </Formsy.Form>
      </div>
    )
  }
});

module.exports = PostEdit;