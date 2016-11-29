import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import ContextPasser from './ContextPasser.jsx'
import { Modal } from 'react-bootstrap';

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
  size: React.PropTypes.string
}

ModalTrigger.defaultProps = {
  size: "large"
}

ModalTrigger.contextTypes = {
  actions: React.PropTypes.object,
  events: React.PropTypes.object,
};

Telescope.registerComponent('ModalTrigger', ModalTrigger);
module.exports = ModalTrigger;
export default ModalTrigger;