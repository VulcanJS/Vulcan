// import Core from "meteor/nova:core";
// ({Messages, NovaForms} = Core);

// import Formsy from 'formsy-react';

// const PostNew = React.createClass({

//   propTypes: {
//     currentUser: React.PropTypes.object,
//     postNewCallback: React.PropTypes.func,
//     closeModal: React.PropTypes.func
//   },

//   getInitialState() {
//     return {
//       canSubmit: false
//     }
//   },
  
//   submitForm(data) {
//     // remove any empty properties
//     post = _.compactObject(data); 

//     post = Telescope.callbacks.run("posts.new.client", post);

//     Meteor.call('posts.new', post, (error, post) => {
//       if (error) {
//         console.log(error)
//         Messages.flash(error.message, "error")
//       } else {
//         Messages.flash("Post created.", "success");
//         FlowRouter.go('posts.single', post);
//         if (this.props.closeModal) {
//           this.props.closeModal();
//         }
//       }
//     });
//   },

//   render() {
     
//     ({CanCreatePost} = Telescope.components);

//     const fields = Posts.simpleSchema().getEditableFields(this.props.currentUser);

//     return (
//       <CanCreatePost user={this.props.currentUser}>
//         <div className="post-new">
//           <h3>New Post</h3>
//           <Formsy.Form onSubmit={this.submitForm}>
//             {fields.map(fieldName => NovaForms.getComponent(fieldName, Posts.simpleSchema()._schema[fieldName]))}
//             <button type="submit" className="button button--primary">Submit</button>
//           </Formsy.Form>
//         </div>
//       </CanCreatePost>
//     )
//   }
// });

// module.exports = PostNew;