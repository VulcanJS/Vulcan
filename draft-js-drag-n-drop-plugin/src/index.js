import handleDrop from './handleDrop';
import createDecorator from './createDecorator';

const createBlockDndPlugin = () => {
  const store = {
    getReadOnly: undefined,
  };
  return {
    initialize: ({ getReadOnly }) => {
      store.getReadOnly = getReadOnly;
    },
    decorator: createDecorator({ store }),
    // Handle blocks dragged and dropped across the editor
    handleDrop,
  };
};

export default createBlockDndPlugin;
