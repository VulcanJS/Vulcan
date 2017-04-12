import multer from 'multer';
import fs from 'fs';

/* Use like this with express

 app.post('/upload', require('draft-js-drag-n-drop-upload-plugin/server')({
 folder: './buildTemplate/images'
 }));

 */

module.exports = function uploadEndpoint(options) {
  // Simple upload endpoint
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, options.folder);
    },

    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  });
  const upload = multer({
    storage,
    limits: {
      fields: 10,
      files: 3,
      fileSize: 1000000,
    },
  }).array('files', 3);

  function afterUpload(req, res) {
    const files = req.files;
    setTimeout(() => {
      req.files.forEach((file) => {
        fs.unlink(file.path, () => {
          // if (err) console.error(err);
        });
      });
    }, 1 * 60000);
    res.json({
      success: true,
      files: files.map((file) => ({
        encoding: file.encoding,
        filename: file.filename,
        mimetype: file.mimetype,
        originalname: file.originalname,
        size: file.originalname,
        url: `/${file.originalname}`,
      })),
    });
  }

  return [upload, afterUpload];
};
