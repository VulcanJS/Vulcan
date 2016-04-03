import React, { PropTypes, Component } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';

const customStyles = {
  content : {
    position                   : 'absolute',
    top                        : '40px',
    left                       : '10%',
    right                      : '10%',
    bottom                     : '40px',
    border                     : '1px solid #ccc',
    background                 : '#fff',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '5px',
    outline                    : 'none',
    padding                    : '20px'
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

  getChildContext() {
    const component = this;
    return {
      closeCallback: component.closeModal
    };
  }

  render() {

    const triggerComponent = React.cloneElement(this.props.component, { onClick: this.openModal });

    if (this.props.size === "small") {
      customStyles.content.left = "20%";
      customStyles.content.right = "20%";
      customStyles.content.top = "60px";
      customStyles.content.bottom = "60px";
    }

    return (
      <div className="modal-trigger">
        {triggerComponent}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} 
        >
          {this.props.children}
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
  size: "medium"
}

ModalTrigger.childContextTypes = {
  closeCallback: React.PropTypes.func
}

module.exports = ModalTrigger;
export default ModalTrigger;