import { registerComponent } from 'meteor/vulcan:lib';
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal'

const BootstrapModal = ({ children, size, show, onHide, title, showCloseButton, footerContent, ...rest }) => {

  const header = title ? <Modal.Header closeButton={showCloseButton}><Modal.Title>{title}</Modal.Title></Modal.Header> : showCloseButton ? <Modal.Header closeButton={showCloseButton}></Modal.Header> : null;
  const footer = footerContent ? <Modal.Footer>{footerContent}</Modal.Footer> : null;
  return (
    <Modal bsSize={size} show={show} onHide={onHide} {...rest}>
      {header}
      <Modal.Body>
        {children}
      </Modal.Body>
      {footer}
    </Modal>
  );
};

BootstrapModal.propTypes = {
  size: PropTypes.string,
  show: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onHide: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  footerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

BootstrapModal.defaultProps = {
  size: 'large',
  show: false,
  showCloseButton: true,
}

registerComponent('Modal', BootstrapModal);
