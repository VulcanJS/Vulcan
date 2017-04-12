import { EditorState } from 'draft-js';

export default function (editorState, key, data) {
  const currentContentState = editorState.getCurrentContent();

  const block = currentContentState.getBlockForKey(key);
  const entityKey = block.getEntityAt(0);
  currentContentState.mergeEntityData(entityKey, data);

  return EditorState.forceSelection(editorState, editorState.getCurrentContent().getSelectionAfter());
}
