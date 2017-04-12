// Check if drag event contains files (not text)
export function containsFiles(event) {
  if (event.dataTransfer.types) {
    for (let i = 0; i < event.dataTransfer.types.length; i += 1) {
      if (event.dataTransfer.types[i] === 'Files') {
        return true;
      }
    }
  }

  return false;
}

// Read file contents intelligently as plain text/json, image as dataUrl or
// anything else as binary
export function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    // This is called when finished reading
    reader.onload = (event) => {
      // Return an array with one image
      resolve({
        // These are attributes like size, name, type, ...
        lastModifiedDate: file.lastModifiedDate,
        lastModified: file.lastModified,
        name: file.name,
        size: file.size,
        type: file.type,

        // This is the files content as base64
        src: event.target.result,
      });
    };

    if (file.type.indexOf('text/') === 0 || file.type === 'application/json') {
      reader.readAsText(file);
    } else if (file.type.indexOf('image/') === 0) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
}

// Read multiple files using above function
export function readFiles(files) {
  return Promise.all(files.map(readFile));
}
