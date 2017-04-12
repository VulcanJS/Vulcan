import getBlockMapKeys from './getBlockMapKeys';

export default (editorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  return getBlockMapKeys(contentState, selectionState.getStartKey(), selectionState.getEndKey());
};
