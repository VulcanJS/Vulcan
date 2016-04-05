import React, { PropTypes, Component } from 'react';
import { Modal } from 'react-bootstrap';
// import Modal from 'react-modal';

class ContextPasser extends Component {

  getChildContext() {

    return {
      closeCallback: this.props.closeCallback,
      currentUser: this.props.currentUser // pass on currentUser
    };
  }

  render() {
    return this.props.children;
  }
}
ContextPasser.childContextTypes = {
  closeCallback: React.PropTypes.func,
  currentUser: React.PropTypes.object
};

class ModalTrigger extends Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  // getChildContext() {
  //   const component = this;
  //   return {
  //     closeCallback: component.closeModal,
  //     currentUser: this.context.currentUser // pass on currentUser
  //   };
  // }

  render() {

    const triggerComponent = React.cloneElement(this.props.component, { onClick: this.openModal });

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Modal bsSize={this.props.size} show={this.state.modalIsOpen} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ContextPasser currentUser={this.context.currentUser} closeCallback={this.props.closeCallback}>
              {this.props.children}
            </ContextPasser>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
};

ModalTrigger.propTypes = {
  component: React.PropTypes.object.isRequired,
  size: React.PropTypes.string
}

ModalTrigger.defaultProps = {
  size: "large"
}

ModalTrigger.contextTypes = {
  currentUser: React.PropTypes.object
};

// ModalTrigger.childContextTypes = {
//   closeCallback: React.PropTypes.func,
//   currentUser: React.PropTypes.object
// }

module.exports = ModalTrigger;
export default ModalTrigger;