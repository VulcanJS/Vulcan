import React from 'react';
import Table from './components/table';
import nestedEditorCreator from './components/nested-editor';
import styles from './style.css';

const defaultTheme = {
  ...styles,
};

const createRenderer = (Editor) => {
  const NestedEditor = nestedEditorCreator(Editor);
  return ({ block, editorState, onChange, setFocus, active }) => {
    const { pluginEditor } = block.props.blockProps;
    return (
      <NestedEditor {...pluginEditor.props} setFocus={setFocus} setReadOnly={pluginEditor.setReadOnly} readOnly={!active} editorState={editorState} onChange={onChange} />
    );
  };
};

const tablePlugin = (config = {}) => {
  const type = config.type || 'block-table';
  const theme = config.theme ? config.theme : defaultTheme;
  const Editor = config.Editor;
  const renderNestedEditor = createRenderer(Editor);

  const component = config.component || Table({ theme });

  return {
    // Handle 'block-image' block-type with Image component
    blockRendererFn: (contentBlock) => {
      const blockType = contentBlock.getType();
      if (blockType === type) {
        return {
          component,
          props: {
            renderNestedEditor
          }
        };
      } return {
        props: {
          renderNestedEditor
        }
      };
    }
  };
};

export default tablePlugin;
export const tableCreator = Table;
export const tableStyles = styles;
