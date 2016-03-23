import React, { PropTypes, Component } from 'react';
import Formsy from 'formsy-react';
import FRC from 'formsy-react-components';
import Actions from '../../actions.js';

const Textarea = FRC.Textarea;

class CommentEdit extends Component {

  constructor() {
    super();
    this.submitComment = this.submitComment.bind(this);
  }

  submitComment(data) {
    data = {$set: data};
    Actions.call("comments.edit", data, this.props.comment._id, (error, result) => {
      if (error) {
        // handle error
      } else {
        this.props.submitCallback();
      }
    });
  }

  render() {
    return (
      <Formsy.Form onSubmit={this.submitComment}>
        <Textarea
          name="body"
          value={this.props.comment.body}
          label="Body"
          type="text"
          className="textarea"
        />
        <button type="submit" className="button button--primary">Submit</button>
        <a href="#" onClick={this.props.cancelCallback} className="button button--secondary">Cancel</a>
      </Formsy.Form>
    )
  }

}

CommentEdit.propTypes = {
  comment: React.PropTypes.object.isRequired,
  submitCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

module.exports = CommentEdit;