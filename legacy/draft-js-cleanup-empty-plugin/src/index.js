import onBackspace from './utils/onBackspace';

// Block-Types to be handled will be stored here
let types = [];
const cleanupEmptyPlugin = (config = {}) => {
  types = config.types || [];
  return {
    handleKeyCommand(command, { getEditorState, setEditorState }) {
      const editorState = getEditorState();
      let newEditorState = null;
      if (command.indexOf('backspace') === 0) {
        newEditorState = onBackspace(editorState, types);
      }

      if (newEditorState) {
        setEditorState(newEditorState);
        return true;
      } return false;
    },
  };
};

export default cleanupEmptyPlugin;

// Use this to add one type to the list
export const cleanupType = (item) => types.push(item);

// Use this to add multiple types to the list
export const cleanupTypes = (items) => types.push(...items);
