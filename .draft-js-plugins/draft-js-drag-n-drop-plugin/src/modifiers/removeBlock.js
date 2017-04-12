import { Modifier, SelectionState } from 'draft-js';

export default function (contentState, blockKey) {
  const afterKey = contentState.getKeyAfter(blockKey);
  const afterBlock = contentState.getBlockForKey(afterKey);
  let targetRange;

  // Only if the following block the last with no text then the whole block
  // should be removed. Otherwise the block should be reduced to an unstyled block
  // without any characters.
  if (afterBlock &&
        afterBlock.getType() === 'unstyled' &&
        afterBlock.getLength() === 0 &&
        afterBlock === contentState.getBlockMap().last()) {
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: afterKey,
      focusOffset: 0,
    });
  } else {
    targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
  }

  // change the blocktype and remove the characterList entry with the block
  const newContentState = Modifier.setBlockType(
    contentState,
    targetRange,
    'unstyled'
  );
  return Modifier.removeRange(newContentState, targetRange, 'backward');
}
