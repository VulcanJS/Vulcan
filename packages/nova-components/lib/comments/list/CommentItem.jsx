import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';

const Textarea = FRC.Textarea;

const CommentItem = React.createClass({

  getInitialState() {
    return {showReply: false};
  },

  showReply(event) {
    event.preventDefault();
    this.setState({showReply: true});
  },

  cancelReply(event) {
    event.preventDefault();
    this.setState({showReply: false});
  },

  submitComment(data) {
    
    data = {
      ...data, 
      postId: this.props.postId, 
      parentCommentId: this.props._id
    }

    // if current comment has a parent use its topLevelCommentId; if it doesn't then it *is* the top level comment
    data.topLevelCommentId = this.props.parentCommentId ? this.props.topLevelCommentId : this.props._id;

    console.log(data)

    Meteor.call("comments.new", data, (error, result) => {
      // if (result) {
      //   this.cancelReply();
      // }
    });
  },

  renderReply() {
    return (
      <div className="comment-reply">
        <Formsy.Form onSubmit={this.submitComment}>
          <Textarea
            name="body"
            value=""
            label="Body"
            type="text"
          />
          <button type="submit">Submit</button>
        </Formsy.Form>
        <a href="#" onClick={this.cancelReply}>Cancel</a>
      </div>
    )
  },

  render() {
    const htmlBody = {__html: this.props.htmlBody};
    return (
      <li className="comment">
        <div dangerouslySetInnerHTML={htmlBody}></div>
        <a href="#" onClick={this.showReply}>Reply</a>
        {this.state.showReply ? this.renderReply() : ""}
      </li>
    )
  }

});

module.exports = CommentItem;