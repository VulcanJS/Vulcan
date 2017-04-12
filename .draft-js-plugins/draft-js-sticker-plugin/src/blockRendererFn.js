import removeSticker from './modifiers/removeSticker';

export default (config) => (contentBlock, { getEditorState, setEditorState }) => {
  const type = contentBlock.getType();
  if (type === 'sticker') {
    return {
      component: config.Sticker,
      props: {
        onRemove: (blockKey) => {
          setEditorState(removeSticker(getEditorState(), blockKey));
        },
      },
    };
  }

  return undefined;
};
