// Filter editorState's blockMap
export function getBlocksWhereEntityData(editorState, filter) {
  const contentState = editorState.getCurrentContent();
  return contentState.get('blockMap').filter((block) => {
    const entityData = block.getEntityAt(0) ? contentState.getEntity(block.getEntityAt(0)).getData() : null;
    return entityData && filter(entityData);
  });
}
