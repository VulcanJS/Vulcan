import React, { Component } from 'react';
import { genKey } from 'draft-js';
import Entry from './Entry';
import addEmoji from '../modifiers/addEmoji';
import getSearchText from '../utils/getSearchText';
import decodeOffsetKey from '../utils/decodeOffsetKey';


export default class EmojiSuggestions extends Component {

  state = {
    isActive: false,
    focusedOptionIndex: 0,
  };

  componentWillMount() {
    this.key = genKey();
    this.props.callbacks.onChange = this.onEditorStateChange;
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.popover) {
      // In case the list shrinks there should be still an option focused.
      // Note: this might run multiple times and deduct 1 until the condition is
      // not fullfilled anymore.
      const size = this.filteredEmojis.size;
      if (size > 0 && this.state.focusedOptionIndex >= size) {
        this.setState({
          focusedOptionIndex: size - 1,
        });
      }

      const decoratorRect = this.props.store.getPortalClientRect(this.activeOffsetKey);
      const newStyles = this.props.positionSuggestions({
        decoratorRect,
        prevProps,
        prevState,
        props: this.props,
        state: this.state,
        filteredEmojis: this.filteredEmojis,
        popover: this.popover,
      });
      Object.keys(newStyles).forEach((key) => {
        this.popover.style[key] = newStyles[key];
      });
    }
  };

  componentWillUnmount = () => {
    this.props.callbacks.onChange = undefined;
  };

  onEditorStateChange = (editorState) => {
    const searches = this.props.store.getAllSearches();

    // if no search portal is active there is no need to show the popover
    if (searches.size === 0) {
      return editorState;
    }

    const removeList = () => {
      this.props.store.resetEscapedSearch();
      this.closeDropdown();
      return editorState;
    };

    // get the current selection
    const selection = editorState.getSelection();
    const anchorOffset = selection.getAnchorOffset();

    // the list should not be visible if a range is selected or the editor has no focus
    if (!selection.isCollapsed() || !selection.getHasFocus()) return removeList();

    // identify the start & end positon of each search-text
    const offsetDetails = searches.map((offsetKey) => decodeOffsetKey(offsetKey));

    // a leave can be empty when it is removed due e.g. using backspace
    const leaves = offsetDetails.map(({ blockKey, decoratorKey, leafKey }) => (
      editorState
        .getBlockTree(blockKey)
        .getIn([decoratorKey, 'leaves', leafKey])
    ));

    // if all leaves are undefined the popover should be removed
    if (leaves.every((leave) => leave === undefined)) {
      return removeList();
    }

    // Checks that the cursor is after the @ character but still somewhere in
    // the word (search term). Setting it to allow the cursor to be left of
    // the @ causes troubles due selection confusion.
    const selectionIsInsideWord = leaves
      .filter((leave) => leave !== undefined)
      .map(({ start, end }) => (
        (start === 0 && anchorOffset === 1 && anchorOffset <= end) || // @ is the first character
        (anchorOffset > start + 1 && anchorOffset <= end) // @ is in the text or at the end
      ));
    if (selectionIsInsideWord.every((isInside) => isInside === false)) return removeList();

    this.activeOffsetKey = selectionIsInsideWord
      .filter((value) => value === true)
      .keySeq()
      .first();

    this.onSearchChange(editorState, selection);

    // make sure the escaped search is reseted in the cursor since the user
    // already switched to another emoji search
    if (!this.props.store.isEscaped(this.activeOffsetKey)) {
      this.props.store.resetEscapedSearch();
    }

    // If none of the above triggered to close the window, it's safe to assume
    // the dropdown should be open. This is useful when a user focuses on another
    // input field and then comes back: the dropdown will again.
    if (!this.state.isActive && !this.props.store.isEscaped(this.activeOffsetKey)) {
      this.openDropdown();
    }

    // makes sure the focused index is reseted every time a new selection opens
    // or the selection was moved to another emoji search
    if (this.lastSelectionIsInsideWord === undefined || !selectionIsInsideWord.equals(this.lastSelectionIsInsideWord)) {
      this.setState({
        focusedOptionIndex: 0,
      });
    }

    this.lastSelectionIsInsideWord = selectionIsInsideWord;

    return editorState;
  };

  onSearchChange = (editorState, selection) => {
    const { word } = getSearchText(editorState, selection);
    const searchValue = word.substring(1, word.length);
    if (this.lastSearchValue !== searchValue && typeof this.props.onSearchChange === 'function') {
      this.lastSearchValue = searchValue;
      this.props.onSearchChange({ value: searchValue });
    }
  };

  onDownArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    const newIndex = this.state.focusedOptionIndex + 1;
    this.onEmojiFocus(newIndex >= this.filteredEmojis.size ? 0 : newIndex);
  };

  onTab = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    this.commitSelection();
  };

  onUpArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    if (this.filteredEmojis.size > 0) {
      const newIndex = this.state.focusedOptionIndex - 1;
      this.onEmojiFocus(Math.max(newIndex, 0));
    }
  };

  onEscape = (keyboardEvent) => {
    keyboardEvent.preventDefault();

    const activeOffsetKey = this.lastSelectionIsInsideWord
      .filter((value) => value === true)
      .keySeq()
      .first();
    this.props.store.escapeSearch(activeOffsetKey);
    this.closeDropdown();

    // to force a re-render of the outer component to change the aria props
    this.props.store.setEditorState(this.props.store.getEditorState());
  };

  onEmojiSelect = (emoji) => {
    this.closeDropdown();
    const newEditorState = addEmoji(
      this.props.store.getEditorState(),
      emoji,
    );
    this.props.store.setEditorState(newEditorState);
  };

  onEmojiFocus = (index) => {
    const descendant = `emoji-option-${this.key}-${index}`;
    this.props.ariaProps.ariaActiveDescendantID = descendant;
    this.state.focusedOptionIndex = index;

    // to force a re-render of the outer component to change the aria props
    this.props.store.setEditorState(this.props.store.getEditorState());
  };

  // Get the first 6 emojis that match
  getEmojisForFilter = () => {
    const selection = this.props.store.getEditorState().getSelection();
    const { word } = getSearchText(this.props.store.getEditorState(), selection);
    const emojiValue = word.substring(1, word.length).toLowerCase();
    const filteredValues = this.props.shortNames.filter((emojiShortName) => (
      !emojiValue || emojiShortName.indexOf(emojiValue) > -1
    ));
    const size = filteredValues.size < 9 ? filteredValues.size : 9;
    return filteredValues.setSize(size);
  };

  commitSelection = () => {
    this.onEmojiSelect(this.filteredEmojis.get(this.state.focusedOptionIndex));
    return 'handled';
  };

  openDropdown = () => {
    // This is a really nasty way of attaching & releasing the key related functions.
    // It assumes that the keyFunctions object will not loose its reference and
    // by this we can replace inner parameters spread over different modules.
    // This better be some registering & unregistering logic. PRs are welcome :)
    this.props.callbacks.onDownArrow = this.onDownArrow;
    this.props.callbacks.onUpArrow = this.onUpArrow;
    this.props.callbacks.onEscape = this.onEscape;
    this.props.callbacks.handleReturn = this.commitSelection;
    this.props.callbacks.onTab = this.onTab;

    const descendant = `emoji-option-${this.key}-${this.state.focusedOptionIndex}`;
    this.props.ariaProps.ariaActiveDescendantID = descendant;
    this.props.ariaProps.ariaOwneeID = `emojis-list-${this.key}`;
    this.props.ariaProps.ariaHasPopup = 'true';
    this.props.ariaProps.ariaExpanded = 'true';
    this.setState({
      isActive: true,
    });

    if (this.props.onOpen) {
      this.props.onOpen();
    }
  };

  closeDropdown = () => {
    // make sure none of these callbacks are triggered
    this.props.callbacks.onDownArrow = undefined;
    this.props.callbacks.onUpArrow = undefined;
    this.props.callbacks.onTab = undefined;
    this.props.callbacks.onEscape = undefined;
    this.props.callbacks.handleReturn = undefined;
    this.props.ariaProps.ariaHasPopup = 'false';
    this.props.ariaProps.ariaExpanded = 'false';
    this.props.ariaProps.ariaActiveDescendantID = undefined;
    this.props.ariaProps.ariaOwneeID = undefined;
    this.setState({
      isActive: false,
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    if (!this.state.isActive) {
      return null;
    }

    this.filteredEmojis = this.getEmojisForFilter();
    const {
      theme = {},
      cacheBustParam,
      imagePath,
      imageType,
      ariaProps, // eslint-disable-line no-unused-vars
      callbacks, // eslint-disable-line no-unused-vars
      onClose, // eslint-disable-line no-unused-vars
      onOpen, // eslint-disable-line no-unused-vars
      onSearchChange, // eslint-disable-line no-unused-vars
      positionSuggestions, // eslint-disable-line no-unused-vars
      shortNames, // eslint-disable-line no-unused-vars
      store, // eslint-disable-line no-unused-vars
      ...restProps,
    } = this.props;
    return (
      <div
        {...restProps}
        className={theme.emojiSuggestions}
        role="listbox"
        id={`emojis-list-${this.key}`}
        ref={(element) => {
          this.popover = element;
        }}
      >
        {
          this.filteredEmojis.map((emoji, index) => (
            <Entry
              key={emoji}
              onEmojiSelect={this.onEmojiSelect}
              onEmojiFocus={this.onEmojiFocus}
              isFocused={this.state.focusedOptionIndex === index}
              emoji={emoji}
              index={index}
              id={`emoji-option-${this.key}-${index}`}
              theme={theme}
              imagePath={imagePath}
              imageType={imageType}
              cacheBustParam={cacheBustParam}
            />
          )).toJS()
        }
      </div>
    );
  }
}
