/*

HoC that provides access to flash messages stored in Redux state and actions to operate on them

*/

import { Actions, addAction, addReducer } from 'meteor/nova:lib';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// register messages actions
addAction({
  messages: {
    flash(content, flashType) {
      return {
        type: 'FLASH',
        content,
        flashType,
      };
    },
    clear(i) {
      return {
        type: 'CLEAR',
        i,
      };
    },
    markAsSeen(i) {
      return {
        type: 'MARK_AS_SEEN',
        i,
      };
    },
    clearSeen() {
      return {
        type: 'CLEAR_SEEN'
      };
    },
  }
});

// register messages reducer
addReducer({
  messages: (state = [], action) => {
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
        return state.map(message => {
          return message.seen ? { ...message, show: false } : message;
        });
      default:
        return state;
    }
  },
});

const mapStateToProps = state => ({ messages: state.messages, });
const mapDispatchToProps = dispatch => bindActionCreators(Actions.messages, dispatch);

const withMessages = (component) => connect(mapStateToProps, mapDispatchToProps)(component);

export default withMessages;
