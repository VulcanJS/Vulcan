import React from 'react';
import Telescope from 'meteor/nova:lib';
//import { messagesActions } from "../messages.js";

// import { createContainer } from 'meteor/react-meteor-data';

// const FlashContainer = createContainer(() => {
//   return {
//     messages: Messages.collection.find({show: true}).fetch()
//   }
// }, params => <params.component {...params} />);

// FlashContainer.displayName = "FlashContainer";

// module.exports = FlashContainer;
// export default FlashContainer;

// note: redux test
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const FlashContainer = connect(mapStateToProps, mapDispatchToProps)((props, context) => <props.component {...props} />);

export default FlashContainer;