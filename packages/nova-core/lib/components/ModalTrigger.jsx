import React, { PropTypes, Component } from 'react';
import ContextPasser from './ContextPasser.jsx'
import { Modal } from 'react-bootstrap';
// import Modal from 'react-modal';

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

  renderHeader() {
    return (
      <Modal.Header closeButton>
        <Modal.Title>{this.props.title}</Modal.Title>
      </Modal.Header>
    )
  }

  render() {

    const triggerComponent = React.cloneElement(this.props.component, { onClick: this.openModal });

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Modal bsSize={this.props.size} show={this.state.modalIsOpen} onHide={this.closeModal}>
          {this.props.title ? this.renderHeader() : null}
          <Modal.Body>
            <ContextPasser 
              currentUser={this.context.currentUser}
              actions={this.context.actions}
              events={this.context.events}
              messages={this.context.messages}
              closeCallback={this.closeModal}
            >
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
  currentUser: React.PropTypes.object,
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
  messages: React.PropTypes.object
};

// ModalTrigger.childContextTypes = {
//   closeCallback: React.PropTypes.func,
//   currentUser: React.PropTypes.object
// }

module.exports = ModalTrigger;
export default ModalTrigger;