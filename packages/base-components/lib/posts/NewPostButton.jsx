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

const NewPostButton = React.createClass({

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
    
    ({PostNewContainer} = Telescope.components);

    return (
      <div className="new-post-button">
        <button onClick={this.openModal} className="button button--primary">New Post</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles} >

          <PostNewContainer postNewCallback={this.closeModal}/>

        </Modal>
      </div>
    )
  }
});

module.exports = NewPostButton;