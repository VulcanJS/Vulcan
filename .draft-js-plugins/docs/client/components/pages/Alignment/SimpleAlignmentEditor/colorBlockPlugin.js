import React from 'react';

const ColorBlock = ({
  block, // eslint-disable-line no-unused-vars
  blockProps, // eslint-disable-line no-unused-vars
  customStyleMap, // eslint-disable-line no-unused-vars
  customStyleFn, // eslint-disable-line no-unused-vars
  decorator, // eslint-disable-line no-unused-vars
  forceSelection, // eslint-disable-line no-unused-vars
  offsetKey, // eslint-disable-line no-unused-vars
  selection, // eslint-disable-line no-unused-vars
  tree, // eslint-disable-line no-unused-vars
  contentState, // eslint-disable-line no-unused-vars
  style,
  ...elementProps
}) => (
  <div
    {...elementProps}
    style={{ width: 200, height: 80, backgroundColor: '#9bc0c7', ...style }}
  />
  );

const createColorBlockPlugin = (config = {}) => {
  const component = config.decorator ? config.decorator(ColorBlock) : ColorBlock;
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = contentState.getEntity(block.getEntityAt(0));
        const type = entity.getType();
        if (type === 'colorBlock') {
          return {
            component,
            editable: false,
          };
        }
      }
      return null;
    },
  };
};

export default createColorBlockPlugin;
