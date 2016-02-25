// // not used anymore

// const PostEditContainer = React.createClass({

//   propTypes: {
//     postId: React.PropTypes.string.isRequired
//   },

//   mixins: [ReactMeteorData],
  
//   getMeteorData() {
//     return {
//       categories: Categories.find().fetch(),
//       // postUrl: Session.get("postUrl"),
//     };
//   },

//   render() {
//     ({ItemContainer, PostEdit} = Telescope.components);

//     return (
//       <ItemContainer
//         propsToPass={this.data}
//         collection={Posts} 
//         publication="posts.single" 
//         terms={{_id: this.props.postId}} 
//         component={PostEdit}
//       />
//     )
//   }

// });

// module.exports = PostEditContainer;