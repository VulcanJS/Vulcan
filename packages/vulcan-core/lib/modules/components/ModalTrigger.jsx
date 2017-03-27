import { registerComponent } from 'meteor/vulcan:lib';
import React, { PropTypes, Component } from 'react';
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

    const triggerComponent = this.props.component ? React.cloneElement(this.props.component, { onClick: this.openModal }) : <a href="#" onClick={this.openModal}>{this.props.label}</a>;
    const childrenComponent = React.cloneElement(this.props.children, {closeModal: this.closeModal});

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Modal className={this.props.className} bsSize={this.props.size} show={this.state.modalIsOpen} onHide={this.closeModal}>
          {this.props.title ? this.renderHeader() : null}
          <Modal.Body>
            {childrenComponent}
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

ModalTrigger.propTypes = {
  className: React.PropTypes.string,
  label: React.PropTypes.string,
  component: React.PropTypes.object,
  size: React.PropTypes.string
}

ModalTrigger.defaultProps = {
  size: "large"
}

registerComponent('ModalTrigger', ModalTrigger);

export default ModalTrigger;
