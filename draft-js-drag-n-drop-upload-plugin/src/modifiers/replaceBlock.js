import { Modifier, EditorState, SelectionState } from 'draft-js';

export default function (editorState, blockKey, newType) {
  let content = editorState.getCurrentContent();

  const targetRange = new SelectionState({
    anchorKey: blockKey,
    anchorOffset: 0,
    focusKey: blockKey,
    focusOffset: 1,
  });

  // change the blocktype and remove the characterList entry with the block
  content = Modifier.setBlockType(
    content,
    targetRange,
    newType
  );

  // force to new selection
  const newState = EditorState.push(editorState, content, 'modify-block');
  return EditorState.forceSelection(newState, editorState.getSelection());
}
