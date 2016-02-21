// const Formsy = require('formsy-react');
// const FRC = require('formsy-react-components');

import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Checkbox = FRC.Checkbox;
const CheckboxGroup = FRC.CheckboxGroup;
const Input = FRC.Input;
const RadioGroup = FRC.RadioGroup;
const Select = FRC.Select;
const Textarea = FRC.Textarea;

const PostNew = React.createClass({

  getInitialState() {
    return {
      canSubmit: false
    }
  },
  
  submitForm(data) {
    // remove any empty properties
    data = _.compactObject(data); 
    Meteor.call('posts.new', data, (error, post) => {
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
          value=""
          label="Status"
          options={Posts.config.postStatuses}
        />
        <Checkbox
          name="sticky"
          value=""
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
      <div className="post-new">
        <h3>New Post</h3>
        <Formsy.Form onSubmit={this.submitForm}>
         <Input
            name="url"
            value=""
            label="URL"
            type="text"
            className="text-input"
          />
          <Input
            name="title"
            value=""
            label="Title"
            type="text"
            className="text-input"
          />
          <Textarea
            name="body"
            value=""
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

module.exports = PostNew;