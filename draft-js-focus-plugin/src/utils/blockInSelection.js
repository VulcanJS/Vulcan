import getSelectedBlocksMapKeys from './getSelectedBlocksMapKeys';

export default (editorState, blockKey) => {
  const selectedBlocksKeys = getSelectedBlocksMapKeys(editorState);
  return selectedBlocksKeys.includes(blockKey);
};
