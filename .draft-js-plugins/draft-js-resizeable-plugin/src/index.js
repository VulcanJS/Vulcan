import { EditorState } from 'draft-js';
import createDecorator from './createDecorator';

const store = {
  getEditorRef: undefined,
  getReadOnly: undefined,
  getEditorState: undefined,
  setEditorState: undefined,
};

const createSetResizeData = (contentBlock, { getEditorState, setEditorState }) => (data) => {
  const entityKey = contentBlock.getEntityAt(0);
  if (entityKey) {
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    contentState.mergeEntityData(entityKey, { ...data });
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  }
};

export default (config) => ({
  initialize: ({ getEditorRef, getReadOnly, getEditorState, setEditorState }) => {
    store.getReadOnly = getReadOnly;
    store.getEditorRef = getEditorRef;
    store.getEditorState = getEditorState;
    store.setEditorState = setEditorState;
  },
  decorator: createDecorator({ config, store }),
  blockRendererFn: (contentBlock, { getEditorState, setEditorState }) => {
    const entityKey = contentBlock.getEntityAt(0);
    const contentState = getEditorState().getCurrentContent();
    const resizeData = entityKey ? contentState.getEntity(entityKey).data : {};
    return {
      props: {
        resizeData,
        setResizeData: createSetResizeData(contentBlock, { getEditorState, setEditorState }),
      },
    };
  }
});
