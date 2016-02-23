import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Textarea = FRC.Textarea;

const CommentNew = React.createClass({

  propTypes: {
    postId: React.PropTypes.string.isRequired,
    submitCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
    type: React.PropTypes.string, // "comment" or "reply"
    parentComment: React.PropTypes.object, // if reply, the comment being replied to
    parentCommentId: React.PropTypes.string, // if reply
    topLevelCommentId: React.PropTypes.string // if reply
  },

  submitComment(data) {
    
    const parentComment = this.props.parentComment;
    const component = this;

    data = {
      ...data, 
      postId: this.props.postId
    }

    if (parentComment) { // replying to a comment
      data = {
        ...data,
        parentCommentId: parentComment._id,
        // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
        topLevelCommentId: parentComment.topLevelCommentId || parentComment._id
      }
    }

    Meteor.call("comments.new", data, (error, result) => {
      if (error) {
        // handle error
      } else {
        if (this.props.submitCallback) {
          this.props.submitCallback();
        }
        // console.log(component)
        // component.refs.commentTextarea.reset(); //TODO: why are refs not working?
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
          className="textarea"
        />
        <button type="submit" className="button button--primary">Submit</button>
      </Formsy.Form>
    )
  }

});

module.exports = CommentNew;