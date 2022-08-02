/*

HoC that provides access to flash messages stored in Redux state and actions to operate on them

     NOTE: the code is voluntary a bit verbose, to provide an example 
     of the apollo-link-state mutation patterns
*/

import React from 'react';
import { registerStateLinkMutation, registerStateLinkDefault } from 'meteor/vulcan:lib';
import { graphql } from '@apollo/client/react/hoc';
import gql from 'graphql-tag';
import { compose } from 'meteor/vulcan:lib';

// 1. Define the queries
// the @client tag tells graphQL that we fetch data from the cache

// read (equivalent to selectors)
const getMessagesQuery = gql`
  query FlashMessage {
    flashMessages @client
  }
`;
// write (equivalent to actions)
const flashQuery = gql`
  mutation flashMessagesFlash($content: JSON) {
    flashMessagesFlash(content: $content) @client
  }
`;
const markAsSeenQuery = gql`
  mutation markAsSeenQuery($i: Number) {
    markAsSeenQuery(i: $i) @client
  }
`;
const clearSeenQuery = gql`
  mutation clearSeenQuery {
    clearSeenQuery @client
  }
`;
const clearQuery = gql`
  mutation clearQuery($i: Number) {
    clearQuery(i: $i) @client
  }
`;

// init the flash message state
registerStateLinkDefault({
  name: 'flashMessages',
  defaultValue: [],
});
// mutations (equivalent to reducers)
registerStateLinkMutation({
  name: 'flashMessagesFlash',
  mutation: (obj, args, context, info) => {
    // get relevant values from args
    const { cache } = context;
    const { content } = args;
    // retrieve current state
    const currentFlashMessages = cache.readQuery({ query: getMessagesQuery }).flashMessages;
    // transform content
    const flashType = content && typeof content.type !== 'undefined' ? content.type : 'error';
    const _id = currentFlashMessages.length;
    const flashMessage = {
      __typename: 'FlashMessage',
      _id,
      ...content,
      type: flashType,
      seen: false,
      show: true,
    };
    // const { } = obj  // the obj param is generally ignored in apollo-state-link
    // const { } = info // barely needed (external info about the query)
    // get the current messages
    // push data
    const data = {
      flashMessages: [...currentFlashMessages, flashMessage],
    };

    cache.writeQuery({
      query: gql`
        query GetFlashMessages {
          flashMessages
        }
      `,
      data,
    });
    return null;
  },
});
registerStateLinkMutation({
  name: 'flashMessagesMarkAsSeen',
  mutation: (obj, args, context) => {
    const { cache } = context;
    const { i } = args;
    const currentFlashMessages = cache.readQuery({ query: getMessagesQuery });
    currentFlashMessages[i] = { ...currentFlashMessages[i], seen: true };
    const data = {
      flashMessages: currentFlashMessages,
    };
    cache.writeQuery({
      query: gql`
        query GetFlashMessages {
          flashMessages
        }
      `,
      data,
    });
    return null;
  },
});
registerStateLinkMutation({
  name: 'flashMessagesClear',
  mutation: (obj, args, context) => {
    const { cache } = context;
    const { i } = args;
    const currentFlashMessages = cache.readQuery({ query: getMessagesQuery });
    currentFlashMessages[i] = { ...currentFlashMessages[i], show: false };
    const data = {
      flashMessages: currentFlashMessages,
    };

    cache.writeQuery({
      query: gql`
        query GetFlashMessages {
          flashMessages
        }
      `,
      data,
    });
    return null;
  },
});
registerStateLinkMutation({
  name: 'flashMessagesClearSeen',
  mutation: (obj, args, context) => {
    const { cache } = context;
    const currentFlashMessages = cache.readQuery({ query: getMessagesQuery });
    const newValue = currentFlashMessages.map(message => (message.seen ? { ...message, show: false } : message));
    const data = {
      flashMessages: newValue,
    };

    cache.writeQuery({
      query: gql`
        query GetFlashMessages {
          flashMessages
        }
      `,
      data,
    });
    return null;
  },
});

const withMessages = compose(
  // equivalent to mapDispatchToProps (map the state-link to the component props, so it can access the mutations)
  graphql(flashQuery, {
    name: 'flash', // name in the props
  }),
  graphql(markAsSeenQuery, {
    name: 'markAsSeen',
  }),
  graphql(clearQuery, {
    name: 'clear',
  }),
  graphql(clearSeenQuery, {
    name: 'clearSeen',
  }),

  // equivalent to mapStateToProps (map the graphql query to the component props)
  graphql(getMessagesQuery, {
    props: ({ ownProps, data /*: { flashMessages }*/ }) => {
      const { flashMessages = [] } = data;
      return { ...ownProps, messages: flashMessages };
    },
  })
);

export default withMessages;

// Equivalent in Redux (code used with Apollo v1):
// addAction({
//   messages: {
//     flash(content) {
//       return {
//         type: 'FLASH',
//         content,
//       };
//     },
//     clear(i) {
//       return {
//         type: 'CLEAR',
//         i,
//       };
//     },
//     markAsSeen(i) {
//       return {
//         type: 'MARK_AS_SEEN',
//         i,
//       };
//     },
//     clearSeen() {
//       return {
//         type: 'CLEAR_SEEN'
//       };
//     },
//   }
// });

// /*

//   Messages reducers

// */

// addReducer({
//   messages: (state = [], action) => {
//     // default values
//     const flashType = action.content && typeof action.content.type !== 'undefined' ? action.content.type : 'error';
//     const currentMsg = typeof action.i === 'undefined' ? {} : state[action.i];

//     switch(action.type) {
//       case 'FLASH':
//         return [
//           ...state,
//           {
//             _id: state.length,
//             ...action.content,
//             type: flashType,
//             seen: false,
//             show: true,
//           },
//         ];
//       case 'MARK_AS_SEEN':
//         return [
//           ...state.slice(0, action.i),
//           { ...currentMsg, seen: true },
//           ...state.slice(action.i + 1),
//         ];
//       case 'CLEAR':
//         return [
//           ...state.slice(0, action.i),
//           { ...currentMsg, show: false },
//           ...state.slice(action.i + 1),
//         ];
//       case 'CLEAR_SEEN':
//         return state.map(message => message.seen ? { ...message, show: false } : message);
//       default:
//         return state;
//     }
//   },
// });

// /*

//   withMessages HOC

// */

// const mapStateToProps = state => ({ messages: state.messages, });
// const mapDispatchToProps = dispatch => bindActionCreators(getActions().messages, dispatch);

// const withMessages = component => connect(mapStateToProps, mapDispatchToProps)(component);

// export default withMessages;
