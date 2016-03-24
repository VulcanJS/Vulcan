import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
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

  render() {
    

    // see http://stackoverflow.com/a/32371612/649299
    const childrenWithProps = React.Children.map(this.props.children, (child) => {

      // if child component already has a successCallback, create new callback 
      // that both calls original callback and also closes modal
      let successCallback;
      if (child.props.successCallback) {
        successCallback = (document) => {
          child.props.successCallback(document);
          this.closeModal();
        }
      } else {
        successCallback = this.closeModal;
      }

      return React.cloneElement(child, { successCallback: successCallback });

    });

    const triggerComponent = React.cloneElement(this.props.component, { onClick: this.openModal });

    return (
      <div className="new-post-button">
        {triggerComponent}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} 
        >
          {childrenWithProps}
        </Modal>
      </div>
    )
  }
};

ModalTrigger.propTypes = {
  component: React.PropTypes.object.isRequired
}

module.exports = ModalTrigger;
export default ModalTrigger;