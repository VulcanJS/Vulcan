// import React from 'react';

const PostEditContainer = React.createClass({

  propTypes: {
    document: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired
  },

  mixins: [ReactMeteorData],
  
  getMeteorData() {
    return {
      categories: Categories.find().fetch(),
      // postUrl: Session.get("postUrl"),
    };
  },

  render() {
    ({PostEdit} = Telescope.components);
    return (
      <PostEdit 
        document={this.props.document} 
        currentUser={this.props.currentUser} 
        categories={this.data.categories}
      />
    )
  }

});

module.exports = PostEditContainer;