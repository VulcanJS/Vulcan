import React, { PropTypes, Component } from 'react';

import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class ModalButton extends Component {

  constructor() {
    super();
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.state = {
      modalIsOpen: false
    };
  }

  openModal(event) {
    event.preventDefault();
    this.setState({modalIsOpen: true});
  }

  closeModal(event) {
    event.preventDefault();
    this.setState({modalIsOpen: false});
  }

  render() {
    
    const Component = this.props.component;

    // see http://stackoverflow.com/a/32371612/649299
    const childrenWithProps = React.Children.map(this.props.children, (child) => {

      // if child component already has a callback, create new callback 
      // that both calls original callback and also closes modal
      let callback;
      if (child.props.callback) {
        callback = (document) => {
          child.props.callback(document);
          this.closeModal();
        }
      } else {
        callback = this.closeModal;
      }

      return React.cloneElement(child, { successCallback: callback });

    });

    return (
      <div className="new-post-button">
        <button onClick={this.openModal} className={this.props.className}>{this.props.label}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >

          {childrenWithProps}

        </Modal>
      </div>
    )
  }
};

ModalButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
}

module.exports = ModalButton;
export default ModalButton;