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

const ModalButton = React.createClass({

  propTypes: {
    label: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  },

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function(event) {
    event.preventDefault();
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render() {
    
    // ({PostNewContainer} = Telescope.components);
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
});

module.exports = ModalButton;
export default ModalButton;