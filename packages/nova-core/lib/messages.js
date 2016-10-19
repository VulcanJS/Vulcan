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

// actions
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

export default Messages;