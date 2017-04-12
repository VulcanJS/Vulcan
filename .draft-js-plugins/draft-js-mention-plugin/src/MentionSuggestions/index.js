import React, { Component, PropTypes } from 'react';
import { genKey } from 'draft-js';
import { List } from 'immutable';
import Entry from './Entry';
import addMention from '../modifiers/addMention';
import decodeOffsetKey from '../utils/decodeOffsetKey';
import getSearchText from '../utils/getSearchText';
import defaultEntryComponent from './Entry/defaultEntryComponent';

export default class MentionSuggestions extends Component {

  static propTypes = {
    entityMutability: PropTypes.oneOf([
      'SEGMENTED',
      'IMMUTABLE',
      'MUTABLE',
    ]),
    entryComponent: PropTypes.func,
    onAddMention: PropTypes.func,
    suggestions: (props, propName, componentName) => {
      if (!List.isList(props[propName])) {
        return new Error(
          `Invalid prop \`${propName}\` supplied to \`${componentName}\`. should be an instance of immutable list.`
        );
      }
      return undefined;
    },
  };

  state = {
    isActive: false,
    focusedOptionIndex: 0,
  };

  componentWillMount() {
    this.key = genKey();
    this.props.callbacks.onChange = this.onEditorStateChange;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions.size === 0 && this.state.isActive) {
      this.closeDropdown();
    }
    if (nextProps.suggestions.size >= 1 && !this.state.isActive) {
      this.openDropdown();
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.popover) {
      // In case the list shrinks there should be still an option focused.
      // Note: this might run multiple times and deduct 1 until the condition is
      // not fullfilled anymore.
      const size = this.props.suggestions.size;
      if (size > 0 && this.state.focusedOptionIndex >= size) {
        this.setState({
          focusedOptionIndex: size - 1,
        });
      }

      // Note: this is a simple protection for the error when componentDidUpdate
      // try to get new getPortalClientRect, but the key already was deleted by
      // previous action. (right now, it only can happened when set the mention
      // trigger to be multi-characters which not supported anyway!)
      if (!this.props.store.getAllSearches().has(this.activeOffsetKey)) {
        return;
      }

      const decoratorRect = this.props.store.getPortalClientRect(this.activeOffsetKey);
      const newStyles = this.props.positionSuggestions({
        decoratorRect,
        prevProps,
        prevState,
        props: this.props,
        state: this.state,
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
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset();

    // the list should not be visible if a range is selected or the editor has no focus
    if (!selection.isCollapsed() || !selection.getHasFocus()) return removeList();

    // identify the start & end positon of each search-text
    const offsetDetails = searches.map((offsetKey) => decodeOffsetKey(offsetKey));

    // a leave can be empty when it is removed due e.g. using backspace
    const leaves = offsetDetails
      .filter(({ blockKey }) => blockKey === anchorKey)
      .map(({ blockKey, decoratorKey, leafKey }) => (
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
    const plainText = editorState.getCurrentContent().getPlainText();
    const selectionIsInsideWord = leaves
      .filter((leave) => leave !== undefined)
      .map(({ start, end }) => (
        (start === 0 && anchorOffset === 1 && plainText.charAt(anchorOffset) !== this.props.mentionTrigger && new RegExp(this.props.mentionTrigger, 'g').test(plainText) && anchorOffset <= end) || // @ is the first character
        (anchorOffset > start + 1 && anchorOffset <= end) // @ is in the text or at the end
      ));

    if (selectionIsInsideWord.every((isInside) => isInside === false)) return removeList();

    const lastActiveOffsetKey = this.activeOffsetKey;
    this.activeOffsetKey = selectionIsInsideWord
      .filter((value) => value === true)
      .keySeq()
      .first();

    this.onSearchChange(editorState, selection, this.activeOffsetKey, lastActiveOffsetKey);

    // make sure the escaped search is reseted in the cursor since the user
    // already switched to another mention search
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
    // or the selection was moved to another mention search
    if (this.lastSelectionIsInsideWord === undefined ||
        !selectionIsInsideWord.equals(this.lastSelectionIsInsideWord)) {
      this.setState({
        focusedOptionIndex: 0,
      });
    }

    this.lastSelectionIsInsideWord = selectionIsInsideWord;

    return editorState;
  };

  onSearchChange = (editorState, selection, activeOffsetKey, lastActiveOffsetKey) => {
    const { word } = getSearchText(editorState, selection);
    const searchValue = word.substring(1, word.length);
    if (this.lastSearchValue !== searchValue || activeOffsetKey !== lastActiveOffsetKey) {
      this.lastSearchValue = searchValue;
      this.props.onSearchChange({ value: searchValue });
    }
  };

  onDownArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    const newIndex = this.state.focusedOptionIndex + 1;
    this.onMentionFocus(newIndex >= this.props.suggestions.size ? 0 : newIndex);
  };

  onTab = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    this.commitSelection();
  };

  onUpArrow = (keyboardEvent) => {
    keyboardEvent.preventDefault();
    if (this.props.suggestions.size > 0) {
      const newIndex = this.state.focusedOptionIndex - 1;
      this.onMentionFocus(newIndex < 0 ? this.props.suggestions.size - 1 : newIndex);
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

  onMentionSelect = (mention) => {
    // Note: This can happen in case a user typed @xxx (invalid mention) and
    // then hit Enter. Then the mention will be undefined.
    if (!mention) {
      return;
    }

    if (this.props.onAddMention) {
      this.props.onAddMention(mention);
    }

    this.closeDropdown();
    const newEditorState = addMention(
      this.props.store.getEditorState(),
      mention,
      this.props.mentionPrefix,
      this.props.mentionTrigger,
      this.props.entityMutability,
    );
    this.props.store.setEditorState(newEditorState);
  };

  onMentionFocus = (index) => {
    const descendant = `mention-option-${this.key}-${index}`;
    this.props.ariaProps.ariaActiveDescendantID = descendant;
    this.state.focusedOptionIndex = index;

    // to force a re-render of the outer component to change the aria props
    this.props.store.setEditorState(this.props.store.getEditorState());
  };

  commitSelection = () => {
    this.onMentionSelect(this.props.suggestions.get(this.state.focusedOptionIndex));
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

    const descendant = `mention-option-${this.key}-${this.state.focusedOptionIndex}`;
    this.props.ariaProps.ariaActiveDescendantID = descendant;
    this.props.ariaProps.ariaOwneeID = `mentions-list-${this.key}`;
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

    const {
      entryComponent,
      popoverComponent = <div />,
      onClose, // eslint-disable-line no-unused-vars
      onOpen, // eslint-disable-line no-unused-vars
      onAddMention, // eslint-disable-line no-unused-vars, no-shadow
      onSearchChange, // eslint-disable-line no-unused-vars, no-shadow
      suggestions, // eslint-disable-line no-unused-vars
      ariaProps, // eslint-disable-line no-unused-vars
      callbacks, // eslint-disable-line no-unused-vars
      theme = {},
      store, // eslint-disable-line no-unused-vars
      entityMutability, // eslint-disable-line no-unused-vars
      positionSuggestions, // eslint-disable-line no-unused-vars
      mentionTrigger, // eslint-disable-line no-unused-vars
      mentionPrefix, // eslint-disable-line no-unused-vars
      ...elementProps } = this.props;

    return React.cloneElement(
      popoverComponent,
      {
        ...elementProps,
        className: theme.mentionSuggestions,
        role: 'listbox',
        id: `mentions-list-${this.key}`,
        ref: (element) => { this.popover = element; },
      },
      this.props.suggestions.map((mention, index) => (
        <Entry
          key={mention.has('id') ? mention.get('id') : mention.get('name')}
          onMentionSelect={this.onMentionSelect}
          onMentionFocus={this.onMentionFocus}
          isFocused={this.state.focusedOptionIndex === index}
          mention={mention}
          index={index}
          id={`mention-option-${this.key}-${index}`}
          theme={theme}
          searchValue={this.lastSearchValue}
          entryComponent={entryComponent || defaultEntryComponent}
        />
      )).toJS()
    );
  }
}
