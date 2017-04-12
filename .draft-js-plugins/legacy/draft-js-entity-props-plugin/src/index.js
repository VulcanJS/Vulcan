import { EditorState } from 'draft-js';
import removeBlock from './utils/removeBlock';

const setEntityDataFn = (contentBlock, { getEditorState, setEditorState }) => (data) => {
  const entityKey = contentBlock.getEntityAt(0);
  if (entityKey) {
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    contentState.mergeEntityData(entityKey, { ...data });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }
};

const removeBlockFn = (contentBlock, { getEditorState, setEditorState }) => () => {
  setEditorState(removeBlock(getEditorState(), contentBlock.get('key')));
};

const entityPropsPlugin = () => ({
  blockRendererFn: (contentBlock, pluginEditor) => {
    const contentState = pluginEditor.getEditorState().getCurrentContent();
    const entityKey = contentBlock.getEntityAt(0);
    const entityData = entityKey ? contentState.getEntity(entityKey).data : {};
    return {
      props: {
        pluginEditor,
        entityData,
        setEntityData: setEntityDataFn(contentBlock, pluginEditor),
        removeBlock: removeBlockFn(contentBlock, pluginEditor)
      },
    };
  },
});

export default entityPropsPlugin;
