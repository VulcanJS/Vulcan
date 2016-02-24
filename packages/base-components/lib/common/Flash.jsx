import Messages from "meteor/nova:core";

const Flash = React.createClass({

  componentDidMount() {
    Messages.markAsRead(this.props.message._id);
  },

  render() {
    return (
      <div className={`flash-message page-message page-message--${this.props.message.type}`}>
        <div className="page-message__text">{this.props.message.content}</div>
      </div>
    )
  }
});

module.exports = Flash;