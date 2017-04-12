import { Map, List } from 'immutable';

import keys from 'lodash.keys';
import decorateComponentWithProps from 'decorate-component-with-props';
import { EditorState } from 'draft-js';
import Emoji from './Emoji';
import EmojiSuggestions from './EmojiSuggestions';
import EmojiSuggestionsPortal from './EmojiSuggestionsPortal';
import emojiStrategy from './emojiStrategy';
import emojiSuggestionsStrategy from './emojiSuggestionsStrategy';
import emojiStyles from './emojiStyles.css';
import emojiSuggestionsStyles from './emojiSuggestionsStyles.css';
import emojiSuggestionsEntryStyles from './emojiSuggestionsEntryStyles.css';
import attachImmutableEntitiesToEmojis from './modifiers/attachImmutableEntitiesToEmojis';
import defaultPositionSuggestions from './utils/positionSuggestions';
import emojiList from './utils/emojiList';

const defaultImagePath = '//cdn.jsdelivr.net/emojione/assets/svg/';
const defaultImageType = 'svg';
const defaultCacheBustParam = '?v=2.2.6';

// TODO activate/deactivate different the conversion or search part

export default (config = {}) => {
  const defaultTheme = {
    emoji: emojiStyles.emoji,

    emojiSuggestions: emojiSuggestionsStyles.emojiSuggestions,

    emojiSuggestionsEntry: emojiSuggestionsEntryStyles.emojiSuggestionsEntry,
    emojiSuggestionsEntryFocused: emojiSuggestionsEntryStyles.emojiSuggestionsEntryFocused,
    emojiSuggestionsEntryText: emojiSuggestionsEntryStyles.emojiSuggestionsEntryText,
    emojiSuggestionsEntryIcon: emojiSuggestionsEntryStyles.emojiSuggestionsEntryIcon,
    emojiSuggestionsEntryAvatar: emojiSuggestionsEntryStyles.emojiSuggestionsEntryAvatar,
  };

  const callbacks = {
    keyBindingFn: undefined,
    handleKeyCommand: undefined,
    onDownArrow: undefined,
    onUpArrow: undefined,
    onTab: undefined,
    onEscape: undefined,
    handleReturn: undefined,
    onChange: undefined,
  };

  const ariaProps = {
    ariaHasPopup: 'false',
    ariaExpanded: 'false',
    ariaOwneeID: undefined,
    ariaActiveDescendantID: undefined,
  };

  let searches = Map();
  let escapedSearch;
  let clientRectFunctions = Map();

  const store = {
    getEditorState: undefined,
    setEditorState: undefined,
    getPortalClientRect: (offsetKey) => clientRectFunctions.get(offsetKey)(),
    getAllSearches: () => searches,
    isEscaped: (offsetKey) => escapedSearch === offsetKey,
    escapeSearch: (offsetKey) => {
      escapedSearch = offsetKey;
    },

    resetEscapedSearch: () => {
      escapedSearch = undefined;
    },

    register: (offsetKey) => {
      searches = searches.set(offsetKey, offsetKey);
    },

    updatePortalClientRect: (offsetKey, func) => {
      clientRectFunctions = clientRectFunctions.set(offsetKey, func);
    },

    unregister: (offsetKey) => {
      searches = searches.delete(offsetKey);
      clientRectFunctions = clientRectFunctions.delete(offsetKey);
    },
  };

  // Styles are overwritten instead of merged as merging causes a lot of confusion.
  //
  // Why? Because when merging a developer needs to know all of the underlying
  // styles which needs a deep dive into the code. Merging also makes it prone to
  // errors when upgrading as basically every styling change would become a major
  // breaking change. 1px of an increased padding can break a whole layout.
  const {
    theme = defaultTheme,
    positionSuggestions = defaultPositionSuggestions,
    imagePath = defaultImagePath,
    imageType = defaultImageType,
    allowImageCache,
    priorityList,
  } = config;

  const cacheBustParam = allowImageCache ? '' : defaultCacheBustParam;

  // if priorityList is configured in config then set priorityList
  if (priorityList) emojiList.setPriorityList(priorityList);
  const emojiSearchProps = {
    ariaProps,
    cacheBustParam,
    callbacks,
    imagePath,
    imageType,
    theme,
    store,
    positionSuggestions,
    shortNames: List(keys(emojiList.list)),
  };
  return {
    EmojiSuggestions: decorateComponentWithProps(EmojiSuggestions, emojiSearchProps),
    decorators: [
      {
        strategy: emojiStrategy,
        component: decorateComponentWithProps(Emoji, { theme, imagePath, imageType, cacheBustParam }),
      },
      {
        strategy: emojiSuggestionsStrategy,
        component: decorateComponentWithProps(EmojiSuggestionsPortal, { store }),
      },
    ],
    getAccessibilityProps: () => (
      {
        role: 'combobox',
        ariaAutoComplete: 'list',
        ariaHasPopup: ariaProps.ariaHasPopup,
        ariaExpanded: ariaProps.ariaExpanded,
        ariaActiveDescendantID: ariaProps.ariaActiveDescendantID,
        ariaOwneeID: ariaProps.ariaOwneeID,
      }
    ),

    initialize: ({ getEditorState, setEditorState }) => {
      store.getEditorState = getEditorState;
      store.setEditorState = setEditorState;
    },

    onDownArrow: (keyboardEvent) => callbacks.onDownArrow && callbacks.onDownArrow(keyboardEvent),
    onTab: (keyboardEvent) => callbacks.onTab && callbacks.onTab(keyboardEvent),
    onUpArrow: (keyboardEvent) => callbacks.onUpArrow && callbacks.onUpArrow(keyboardEvent),
    onEscape: (keyboardEvent) => callbacks.onEscape && callbacks.onEscape(keyboardEvent),
    handleReturn: (keyboardEvent) => callbacks.handleReturn && callbacks.handleReturn(keyboardEvent),
    onChange: (editorState) => {
      let newEditorState = attachImmutableEntitiesToEmojis(editorState);

      if (!newEditorState.getCurrentContent().equals(editorState.getCurrentContent())) {
        // Forcing the current selection ensures that it will be at it's right place.
        // This solves the issue where inserting an Emoji on OSX with Apple's Emoji
        // selector led to the right selection the data, but wrong position in
        // the contenteditable.
        newEditorState = EditorState.forceSelection(
          newEditorState,
          newEditorState.getSelection(),
        );
      }

      if (callbacks.onChange) return callbacks.onChange(newEditorState);
      return newEditorState;
    },
  };
};
