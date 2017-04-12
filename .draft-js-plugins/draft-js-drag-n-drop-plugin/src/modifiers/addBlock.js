import { List, Repeat } from 'immutable';
import {
  Modifier,
  CharacterMetadata,
  BlockMapBuilder,
  ContentBlock,
  genKey
} from 'draft-js';

export default function (editorState, selection, type, data, entityType, text = ' ') {
  const currentContentState = editorState.getCurrentContent();
  const currentSelectionState = selection;

  // in case text is selected it is removed and then the block is appended
  const afterRemovalContentState = Modifier.removeRange(
    currentContentState,
    currentSelectionState,
    'backward'
  );

  // deciding on the postion to split the text
  const targetSelection = afterRemovalContentState.getSelectionAfter();
  const blockKeyForTarget = targetSelection.get('focusKey');
  const block = currentContentState.getBlockForKey(blockKeyForTarget);
  let insertionTargetSelection;
  let insertionTargetBlock;

  // In case there are no characters or entity or the selection is at the start it
  // is safe to insert the block in the current block.
  // Otherwise a new block is created (the block is always its own block)
  const isEmptyBlock = block.getLength() === 0 && block.getEntityAt(0) === null;
  const selectedFromStart = currentSelectionState.getStartOffset() === 0;
  if (isEmptyBlock || selectedFromStart) {
    insertionTargetSelection = targetSelection;
    insertionTargetBlock = afterRemovalContentState;
  } else {
    // the only way to insert a new seems to be by splitting an existing in to two
    insertionTargetBlock = Modifier.splitBlock(afterRemovalContentState, targetSelection);

    // the position to insert our blocks
    insertionTargetSelection = insertionTargetBlock.getSelectionAfter();
  }

  // TODO not sure why we need it …
  const newContentStateAfterSplit = Modifier.setBlockType(insertionTargetBlock, insertionTargetSelection, type);

  // creating a new ContentBlock including the entity with data
  // Entity will be created with a specific type, if defined, else will fall back to the ContentBlock type
  const contentStateWithEntity = newContentStateAfterSplit.createEntity(
    entityType || type, 'IMMUTABLE', { ...data }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const charData = CharacterMetadata.create({ entity: entityKey });

  const fragmentArray = [
    new ContentBlock({
      key: genKey(),
      type,
      text,
      characterList: List(Repeat(charData, text.length || 1)), // eslint-disable-line new-cap
    }),

    // new contentblock so we can continue wrting right away after inserting the block
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List(), // eslint-disable-line new-cap
    }),
  ];

  // create fragment containing the two content blocks
  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  // replace the contentblock we reserved for our insert
  return Modifier.replaceWithFragment(
    newContentStateAfterSplit,
    insertionTargetSelection,
    fragment
  );
}
