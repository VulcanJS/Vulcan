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
    component: React.PropTypes.func.isRequired,
    propsToPass: React.PropTypes.object,
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

    return (
      <div className="new-post-button">
        <button onClick={this.openModal} className={this.props.className}>{this.props.label}</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <Component {...this.props.propsToPass} closeModal={this.closeModal}/>

        </Modal>
      </div>
    )
  }
});

module.exports = ModalButton;