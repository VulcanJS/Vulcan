import handleDroppedFiles from './handleDroppedFiles';

const createDndFileUploadPlugin = (config = {}) => ({
  // Handle file drops
  handleDroppedFiles: handleDroppedFiles(config),
});

export default createDndFileUploadPlugin;
