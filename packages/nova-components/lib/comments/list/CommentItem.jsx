const CommentItem = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired, // the current comment
    currentUser: React.PropTypes.object, // the current user
  },

  getInitialState() {
    return {
      showReply: false,
      showEdit: false
    };
  },

  showReply(event) {
    event.preventDefault();
    this.setState({showReply: true});
  },

  cancelReply(event) {
    event.preventDefault();
    this.setState({showReply: false});
  },

  replyCallback() {
    this.setState({showReply: false});
  },

  showEdit(event) {
    event.preventDefault();
    this.setState({showEdit: true});
  },
  
  cancelEdit(event) {
    event.preventDefault();
    this.setState({showEdit: false});
  },

  editCallback() {
    this.setState({showEdit: false});
  },

  renderComment() {
    const htmlBody = {__html: this.props.comment.htmlBody};

    return (
      <div dangerouslySetInnerHTML={htmlBody}></div>
    )
  },

  renderReply() {
    
    ({CommentNew} = Telescope.components);

    return (
      <div className="comment-reply">
        <CommentNew postId={this.props.comment.postId} parentComment={this.props.comment} submitCallback={this.replyCallback} cancelCallback={this.cancelReply} type="reply" />
        <a href="#" onClick={this.cancelReply} className="button button--secondary">Cancel</a>
      </div>
    )
  },

  renderEdit() {

    ({CommentEdit}  = Telescope.components);
    
    return (
      <CommentEdit comment={this.props.comment} submitCallback={this.editCallback} cancelCallback={this.cancelEdit}/>
    )
  },

  renderActions() {
    return (
      <ul>
        <li><a href="#" onClick={this.showReply}>Reply</a></li>
        {Users.can.edit(this.props.currentUser, this.props.comment) ? <li><a href="#" onClick={this.showEdit}>Edit</a></li> : ""}
      </ul>
    )
  },

  render() {
    return (
      <div className="comment-item">
        <div className="comment-body">
          {this.state.showEdit ? this.renderEdit() : this.renderComment()}
          {this.renderActions()}
        </div>
        {this.state.showReply ? this.renderReply() : ""}
      </div>
    )
  }

});

module.exports = CommentItem;