import React, { PropTypes, Component } from 'react';
import ContextPasser from './ContextPasser.jsx'
import { Modal } from 'react-bootstrap';
import withCurrentUser from '../containers/withCurrentUser.js';

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
              currentUser={this.props.currentUser}
              actions={this.context.actions}
              events={this.context.events}
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
  currentUser: React.PropTypes.object,
  size: React.PropTypes.string
}

ModalTrigger.defaultProps = {
  size: "large"
}

ModalTrigger.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
};

// ModalTrigger.childContextTypes = {
//   closeCallback: React.PropTypes.func,
//   currentUser: React.PropTypes.object
// }

module.exports = withCurrentUser(ModalTrigger);
export default withCurrentUser(ModalTrigger);