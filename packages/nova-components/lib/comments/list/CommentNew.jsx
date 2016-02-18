import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Textarea = FRC.Textarea;

const CommentNew = React.createClass({

  propTypes: {
    type: React.PropTypes.string, // "comment" or "reply"
    postId: React.PropTypes.string.isRequired,
    parentCommentId: React.PropTypes.string,
    topLevelCommentId: React.PropTypes.string,
    submitCallback: React.PropTypes.func // a callback to execute when the submission has been successful
  },

  submitComment(data) {
    
    data = {
      ...data, 
      postId: this.props.postId, 
      parentCommentId: this.props._id
    }

    // if current comment has a parent use its topLevelCommentId; if it doesn't then it *is* the top level comment
    data.topLevelCommentId = this.props.parentCommentId ? this.props.topLevelCommentId : this.props._id;

    Meteor.call("comments.new", data, (error, result) => {
      if (result) {
        this.props.submitCallback();
      }
    });
  },

  render() {
    return (
      <Formsy.Form onSubmit={this.submitComment}>
        <Textarea
          name="body"
          value=""
          label="Body"
          type="text"
        />
        <button type="submit">Submit</button>
      </Formsy.Form>
    )
  }

});

module.exports = CommentNew;