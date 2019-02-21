import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ModalTrigger extends PureComponent {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
    };
  }

  clickHandler = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
    this.openModal();
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const {
      trigger,
      component,
      children,
      label,
      size,
      className,
      dialogClassName,
      title,
      modalProps,
      header,
      footer,
    } = this.props;

    let triggerComponent = trigger || component;
    triggerComponent = triggerComponent ? (
      React.cloneElement(triggerComponent, { onClick: this.clickHandler })
    ) : (
      <a href="javascript:void(0)" onClick={this.clickHandler}>
        {label}
      </a>
    );
    const childrenComponent = React.cloneElement(children, { closeModal: this.closeModal });
    const headerComponent = header && React.cloneElement(header, { closeModal: this.closeModal });
    const footerComponent = footer && React.cloneElement(footer, { closeModal: this.closeModal });

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Components.Modal
          size={size}
          className={className}
          show={this.state.modalIsOpen}
          onHide={this.closeModal}
          dialogClassName={dialogClassName}
          title={title}
          header={headerComponent}
          footer={footerComponent}
          {...modalProps}
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
  onClick: PropTypes.func,
};

registerComponent('ModalTrigger', ModalTrigger);

export default ModalTrigger;
