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

// note: messy redux test
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// should go elsewhere...
Telescope.reducers.messages = (state = [], action) => {
  let currentMsg = {};
  switch(action.type) {
    case 'FLASH':
      action.flashType = typeof action.flashType === 'undefined' ? 'error' : action.flashType;
      
      return [
        ...state,
        { _id: state.length, content: action.content, flashType: action.flashType, seen: false, show: true },
      ];
    case 'MARK_AS_SEEN':
      currentMsg = state[action.i];
      
      return [
        ...state.slice(0, action.i),
        { ...currentMsg, seen: true },
        ...state.slice(action.i + 1),
      ];
    case 'CLEAR': 
      currentMsg = state[action.i];
      
      return [
        ...state.slice(0, action.i),
        { ...currentMsg, show: false },
        ...state.slice(action.i + 1),
      ];
    case 'CLEAR_SEEN':
      return state.map(message => ({ ...message, show: false }));
    default:
      return state;
  }
};

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const FlashContainer = connect(mapStateToProps, mapDispatchToProps)((props, context) => <props.component {...props} />);

export default FlashContainer;