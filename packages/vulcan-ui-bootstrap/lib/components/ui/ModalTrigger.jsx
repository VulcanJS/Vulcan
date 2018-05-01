import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

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

  render() {

    let triggerComponent = this.props.trigger || this.props.component;
    triggerComponent = triggerComponent ? React.cloneElement(triggerComponent, { onClick: this.openModal }) : <a href="javascript:void(0)" onClick={this.openModal}>{this.props.label}</a>;
    const childrenComponent = React.cloneElement(this.props.children, {closeModal: this.closeModal});

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Components.Modal
          size={this.props.size}
          className={this.props.className}
          show={this.state.modalIsOpen}
          onHide={this.closeModal}
          dialogClassName={this.props.dialogClassName}
          title={this.props.title}
        >
          {childrenComponent}
        </Components.Modal>
      </div>
    );
  }
}

ModalTrigger.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.object, // keep for backwards compatibility
  trigger: PropTypes.object,
  size: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

registerComponent('ModalTrigger', ModalTrigger);

export default ModalTrigger;
