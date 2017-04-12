import { readFile } from 'draft-js-drag-n-drop-upload-plugin/utils/file'; // eslint-disable-line import/no-unresolved

export default function mockUpload(data, success, failed, progress) {
  function doProgress(percent) {
    progress(percent || 1);
    if (percent === 100) {
      // Start reading the file
      Promise.all(data.files.map(readFile)).then((files) => success(files, { retainSrc: true }));
    } else {
      setTimeout(doProgress, 250, (percent || 0) + 10);
    }
  }

  doProgress();
}
