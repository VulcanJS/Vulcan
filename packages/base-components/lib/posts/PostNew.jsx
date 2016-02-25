import Core from "meteor/nova:core";
({Messages, NovaForms} = Core);

import Formsy from 'formsy-react';

const PostNew = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    categories: React.PropTypes.array
  },

  getInitialState() {
    return {
      canSubmit: false
    }
  },
  
  submitForm(data) {
    // remove any empty properties
    post = _.compactObject(data); 

    post = Telescope.callbacks.run("posts.new.client", post);

    Meteor.call('posts.new', post, (error, post) => {
      if (error) {
        console.log(error)
        Messages.flash(error.message, "error")
      } else {
        Messages.flash("Post created.", "success")
        FlowRouter.go('posts.single', post);
      }
    });
  },

  render() {
     
    ({CanCreatePost} = Telescope.components);

    const categoriesOptions = this.props.categories.map(category => {
      return {
        value: category._id,
        label: category.name
      }
    });
    const fields = Posts.simpleSchema().getEditableFields(this.props.currentUser);

    return (
      <CanCreatePost user={this.props.currentUser}>
        <div className="post-new">
          <h3>New Post</h3>
          <Formsy.Form onSubmit={this.submitForm}>
            {fields.map(fieldName => NovaForms.getComponent(fieldName, Posts.simpleSchema()._schema[fieldName]))}
            <button type="submit" className="button button--primary">Submit</button>
          </Formsy.Form>
        </div>
      </CanCreatePost>
    )
  }
});

module.exports = PostNew;