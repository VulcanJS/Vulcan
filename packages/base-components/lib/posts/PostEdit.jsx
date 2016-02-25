import Core from "meteor/nova:core";
({Messages, NovaForms} = Core);

import Formsy from 'formsy-react';

const PostEdit = React.createClass({
  
  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
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

  render() {
     
   ({CanEditPost} = Telescope.components);

    const post = this.props.document;

    const fields = Posts.simpleSchema().getEditableFields(this.props.currentUser);

    return (
      <CanEditPost user={this.props.currentUser} post={post}>
        <div className="post-edit">
          <h3>Edit Post “{post.title}”</h3>
          <Formsy.Form onSubmit={this.submitForm}>
            {fields.map(fieldName => NovaForms.getComponent(fieldName, Posts.simpleSchema()._schema[fieldName], post))}
            <button type="submit" className="button button--primary">Submit</button>
          </Formsy.Form>
        </div>
      </CanEditPost>
    )
  }
});

module.exports = PostEdit;