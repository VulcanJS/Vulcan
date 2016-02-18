import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Textarea = FRC.Textarea;

const CommentNew = React.createClass({

  propTypes: {
    postId: React.PropTypes.string.isRequired,
    submitCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
    type: React.PropTypes.string, // "comment" or "reply"
    comment: React.PropTypes.object, // if reply, the comment being replied to
    parentCommentId: React.PropTypes.string, // if reply
    topLevelCommentId: React.PropTypes.string // if reply
  },

  submitComment(data) {
    
    data = {
      ...data, 
      postId: this.props.comment.postId, 
      parentCommentId: this.props.comment._id
    }

    // if comment being replied to has a parent use its topLevelCommentId; if it doesn't then it *is* the top level comment
    data.topLevelCommentId = this.props.comment.parentCommentId ? this.props.comment.topLevelCommentId : this.props.comment._id;

    Meteor.call("comments.new", data, (error, result) => {
      if (error) {
        // handle error
      } else {
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