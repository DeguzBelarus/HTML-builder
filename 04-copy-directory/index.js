const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

(async function () {
  const sourcePath = path.join(__dirname, "files");
  const destinationPath = path.join(__dirname, "files-copy");

  fs.mkdir(destinationPath, { recursive: true }, (error) => {
    console.log("Creating a folder files-copy...");
    if (error) {
      return console.log(error);
    }
    console.log("The files-copy folder has been created!");
  });

  const files = await readdir(sourcePath, {
    withFileTypes: true,
  });

  let currentFile = 0;
  for (const file of files) {
    fs.copyFile(
      path.join(sourcePath, file.name),
      path.join(destinationPath, file.name),
      (error) => {
        currentFile++;
        console.log(`Copying a file ${file.name}...`);
        if (error) {
          return console.log(error);
        }
        if (currentFile === files.length) {
          console.log("All files have been copied!");
        }
      }
    );
  }
})();
