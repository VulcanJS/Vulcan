import { EditorState } from 'draft-js';
import setSelection from './modifiers/setSelection';
import setSelectionToBlock from './modifiers/setSelectionToBlock';
import createDecorator from './createDecorator';
import createBlockKeyStore from './utils/createBlockKeyStore';
import blockInSelection from './utils/blockInSelection';
import getBlockMapKeys from './utils/getBlockMapKeys';
import defaultTheme from './style.css';

const focusableBlockIsSelected = (editorState, blockKeyStore) => {
  const selection = editorState.getSelection();
  if (selection.getAnchorKey() !== selection.getFocusKey()) {
    return false;
  }
  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(selection.getAnchorKey());
  return blockKeyStore.includes(block.getKey());
};

export default (config = {}) => {
  const blockKeyStore = createBlockKeyStore({});
  const theme = config.theme ? config.theme : defaultTheme;
  let lastSelection;
  let lastContentState;

  return {
    onChange: (editorState) => {
      // in case the content changed there is no need to re-render blockRendererFn
      // since if a block was added it will be rendered anyway and if it was text
      // then the change was not a pure selection change
      const contentState = editorState.getCurrentContent();
      if (!contentState.equals(lastContentState)) {
        lastContentState = contentState;
        return editorState;
      }
      lastContentState = contentState;

      // if the selection didn't change there is no need to re-render
      const selection = editorState.getSelection();
      if (lastSelection && selection.equals(lastSelection)) {
        lastSelection = editorState.getSelection();
        return editorState;
      }

      // Note: Only if the previous or current selection contained a focusableBlock a re-render is needed.
      const focusableBlockKeys = blockKeyStore.getAll();
      if (lastSelection) {
        const lastBlockMapKeys = getBlockMapKeys(contentState, lastSelection.getStartKey(), lastSelection.getEndKey());
        if (lastBlockMapKeys.some((key) => focusableBlockKeys.includes(key))) {
          lastSelection = selection;
          // By forcing the selection the editor will trigger the blockRendererFn which is
          // necessary for the blockProps containing isFocus to be passed down again.
          return EditorState.forceSelection(editorState, editorState.getSelection());
        }
      }

      const currentBlockMapKeys = getBlockMapKeys(contentState, selection.getStartKey(), selection.getEndKey());
      if (currentBlockMapKeys.some((key) => focusableBlockKeys.includes(key))) {
        lastSelection = selection;
        // By forcing the selection the editor will trigger the blockRendererFn which is
        // necessary for the blockProps containing isFocus to be passed down again.
        return EditorState.forceSelection(editorState, editorState.getSelection());
      }

      return editorState;
    },
    keyBindingFn(evt, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      // TODO match by entitiy instead of block type
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        // arrow left
        if (evt.keyCode === 37) {
          setSelection(getEditorState, setEditorState, 'up', evt);
        }
        // arrow right
        if (evt.keyCode === 39) {
          setSelection(getEditorState, setEditorState, 'down', evt);
        }
      }

      // Don't manually overwrite in case the shift key is used to avoid breaking
      // native behaviour that works anyway.
      if (evt.shiftKey) {
        return;
      }

      // arrow left
      if (evt.keyCode === 37) {
        // Covering the case to select the before block
        const selection = editorState.getSelection();
        const selectionKey = selection.getAnchorKey();
        const beforeBlock = editorState.getCurrentContent().getBlockBefore(selectionKey);
        // only if the selection caret is a the left most position
        if (beforeBlock && selection.getAnchorOffset() === 0 && blockKeyStore.includes(beforeBlock.getKey())) {
          setSelection(getEditorState, setEditorState, 'up', evt);
        }
      }
      // arrow right
      if (evt.keyCode === 39) {
        // Covering the case to select the after block
        const selection = editorState.getSelection();
        const selectionKey = selection.getFocusKey();
        const currentBlock = editorState.getCurrentContent().getBlockForKey(selectionKey);
        const afterBlock = editorState.getCurrentContent().getBlockAfter(selectionKey);
        const notAtomicAndLastPost =
          currentBlock.getType() !== 'atomic' &&
          currentBlock.getLength() === selection.getFocusOffset();
        if (afterBlock && notAtomicAndLastPost && blockKeyStore.includes(afterBlock.getKey())) {
          setSelection(getEditorState, setEditorState, 'down', evt);
        }
      }
    },
    // Wrap all block-types in block-focus decorator
    blockRendererFn: (contentBlock, { getEditorState, setEditorState }) => {
      // This makes it mandatory to have atomic blocks for focus but also improves performance
      // since all the selection checks are not necessary.
      // In case there is a use-case where focus makes sense for none atomic blocks we can add it
      // in the future.
      if (contentBlock.getType() !== 'atomic') {
        return undefined;
      }

      const editorState = getEditorState();
      const isFocused = blockInSelection(editorState, contentBlock.getKey());

      return {
        props: {
          isFocused,
          isCollapsedSelection: editorState.getSelection().isCollapsed(),
          setFocusToBlock: () => {
            setSelectionToBlock(getEditorState, setEditorState, contentBlock);
          },
        }
      };
    },
    // Handle down/up arrow events and set activeBlock/selection if necessary
    onDownArrow: (event, { getEditorState, setEditorState }) => {
      // TODO edgecase: if one block is selected and the user wants to expand the selection using the shift key

      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'down', event);
        return;
      }

      // Don't manually overwrite in case the shift key is used to avoid breaking
      // native behaviour that works anyway.
      if (event.shiftKey) {
        return;
      }

      // Covering the case to select the after block with arrow down
      const selectionKey = editorState.getSelection().getAnchorKey();
      const afterBlock = editorState.getCurrentContent().getBlockAfter(selectionKey);
      if (afterBlock && blockKeyStore.includes(afterBlock.getKey())) {
        setSelection(getEditorState, setEditorState, 'down', event);
      }
    },
    onUpArrow: (event, { getEditorState, setEditorState }) => {
      // TODO edgecase: if one block is selected and the user wants to expand the selection using the shift key

      const editorState = getEditorState();
      if (focusableBlockIsSelected(editorState, blockKeyStore)) {
        setSelection(getEditorState, setEditorState, 'up', event);
      }

      // Don't manually overwrite in case the shift key is used to avoid breaking
      // native behaviour that works anyway.
      if (event.shiftKey) {
        return;
      }

      // Covering the case to select the before block with arrow up
      const selectionKey = editorState.getSelection().getAnchorKey();
      const beforeBlock = editorState.getCurrentContent().getBlockBefore(selectionKey);
      if (beforeBlock && blockKeyStore.includes(beforeBlock.getKey())) {
        setSelection(getEditorState, setEditorState, 'up', event);
      }
    },
    decorator: createDecorator({ theme, blockKeyStore }),
  };
};
