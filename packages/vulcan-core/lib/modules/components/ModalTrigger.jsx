import { registerComponent } from 'meteor/vulcan:lib';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal'

class ModalTrigger extends PureComponent {

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
        <Modal
          className={this.props.className}
          bsSize={this.props.size}
          show={this.state.modalIsOpen}
          onHide={this.closeModal}
          dialogClassName={this.props.dialogClassName}
        >
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
  className: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.object,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

ModalTrigger.defaultProps = {
  size: 'large'
}

registerComponent('ModalTrigger', ModalTrigger);

export default ModalTrigger;
