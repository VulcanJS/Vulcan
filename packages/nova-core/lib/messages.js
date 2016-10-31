import Telescope from 'meteor/nova:lib';

const Messages = {
  // Local (client-only) collection
  collection: new Meteor.Collection(null),

  flash(content, type) {
    type = (typeof type === 'undefined') ? 'error': type;
    // Store errors in the local collection
    this.collection.insert({content:content, type:type, seen: false, show:true});
  },

  markAsSeen(messageId) {
    this.collection.update(messageId, {$set: {seen:true}});
  },

  clear(messageId) {
    this.collection.update(messageId, {$set: {show:false}});
  },

  clearSeen() {
    this.collection.update({seen:true}, {$set: {show:false}}, {multi:true});
  }
};

// messages actions
Telescope.actions.messages = {
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
};

// messages reducer
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
      return state.map(message => {
        return message.seen ? { ...message, show: false } : message;
      });
    default:
      return state;
  }
};

export default Messages;