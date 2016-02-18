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
    console.log(data)
    // remove any empty properties
    data = _.compactObject(data); 
    Meteor.call('posts.new', data);
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
          />
          <Input
            name="title"
            value=""
            label="Title"
            type="text"
          />
          <Textarea
            name="body"
            value=""
            label="Body"
            type="text"
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
        <button type="submit" >Submit</button>
      </Formsy.Form>
      </div>
    )
  }
});

module.exports = PostNew;