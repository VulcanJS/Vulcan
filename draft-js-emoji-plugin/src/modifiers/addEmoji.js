import { Modifier, EditorState } from 'draft-js';
import getSearchText from '../utils/getSearchText';
import emojiList from '../utils/emojiList';
import convertShortNameToUnicode from '../utils/convertShortNameToUnicode';

const addEmoji = (editorState, emojiShortName) => {
  const currentSelectionState = editorState.getSelection();
  const { begin, end } = getSearchText(editorState, currentSelectionState);

  // Get the selection of the :emoji: search text
  const emojiTextSelection = currentSelectionState.merge({
    anchorOffset: begin,
    focusOffset: end,
  });

  const unicode = emojiList.list[emojiShortName][0];
  const emoji = convertShortNameToUnicode(unicode);

  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState
    .createEntity('emoji', 'IMMUTABLE', { emojiUnicode: emoji });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let emojiReplacedContent = Modifier.replaceText(
    contentState,
    emojiTextSelection,
    emoji,
    null,
    entityKey
  );

  // If the emoji is inserted at the end, a space is appended right after for
  // a smooth writing experience.
  const blockKey = emojiTextSelection.getAnchorKey();
  const blockSize = contentState.getBlockForKey(blockKey).getLength();
  if (blockSize === end) {
    emojiReplacedContent = Modifier.insertText(
      emojiReplacedContent,
      emojiReplacedContent.getSelectionAfter(),
      ' ',
    );
  }

  const newEditorState = EditorState.push(
    editorState,
    emojiReplacedContent,
    'insert-emoji',
  );
  return EditorState.forceSelection(newEditorState, emojiReplacedContent.getSelectionAfter());
};

export default addEmoji;
