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

  renderReply() {
    
    ({CommentNew} = Telescope.components);

    return (
      <div className="comment-reply">
        <CommentNew type="reply" submitCallback={this.cancelReply} {...this.props} />
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