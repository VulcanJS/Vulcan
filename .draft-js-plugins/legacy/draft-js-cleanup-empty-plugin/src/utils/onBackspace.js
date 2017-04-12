import {
  EditorState,
  Modifier,
  RichUtils,
} from 'draft-js';

export default (editorState, types) => {
  const selection = editorState.getSelection();
  if (!selection.isCollapsed() || selection.getAnchorOffset() || selection.getFocusOffset()) {
    return null;
  }

  // First, try to remove a preceding atomic block.
  const content = editorState.getCurrentContent();
  const startKey = selection.getStartKey();
  const blockAfter = content.getBlockAfter(startKey);

  // If the current block is empty, just delete it.
  if (blockAfter && content.getBlockForKey(startKey).getLength() === 0) {
    return null;
  }

  const blockBefore = content.getBlockBefore(startKey);

  if (blockBefore && types.indexOf(blockBefore.getType()) !== -1) {
    const atomicBlockTarget = selection.merge({
      anchorKey: blockBefore.getKey(),
      anchorOffset: 0,
    });
    const asCurrentStyle = Modifier.setBlockType(content, atomicBlockTarget, content.getBlockForKey(startKey).getType());
    const withoutAtomicBlock = Modifier.removeRange(asCurrentStyle, atomicBlockTarget, 'backward');
    if (withoutAtomicBlock !== content) {
      return EditorState.push(editorState, withoutAtomicBlock, 'remove-range');
    }
  }

  // If that doesn't succeed, try to remove the current block style.
  const withoutBlockStyle = RichUtils.tryToRemoveBlockStyle(editorState);

  if (withoutBlockStyle) {
    return EditorState.push(editorState, withoutBlockStyle, 'change-block-type');
  }

  return null;
};
