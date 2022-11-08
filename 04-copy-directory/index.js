const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

(async function () {
  const sourcePath = path.join(__dirname, "files");
  const destinationPath = path.join(__dirname, "files-copy");

  fs.access(destinationPath, async (error) => {
    if (error) {
      console.log("The files-copy folder hasn't been found!");
      fs.mkdir(destinationPath, { recursive: true }, (error) => {
        console.log("Creating a folder files-copy...");
        if (error) {
          console.log(error);
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
            console.log(`Copying the ${file.name} file...`);
            if (error) {
              return console.log(error);
            }
            if (currentFile === files.length) {
              console.log("All files have been copied!");
            }
          }
        );
      }
    } else {
      console.log("The files-copy folder has been found!");
      const copyFiles = await readdir(destinationPath, {
        withFileTypes: true,
      });

      if (copyFiles.length) {
        console.log("Clearing the copy-files folder...");
        copyFiles.forEach((copyFile, index) => {
          fs.unlink(path.join(destinationPath, copyFile.name), (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log(`The ${copyFile.name} file has been deleted`);

              if (index === copyFiles.length - 1) {
                console.log(
                  "Clearing of the copy-files folder has been completed!"
                );
              }
            }
          });
        });
      }

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
            console.log(`Copying the ${file.name} file...`);
            if (error) {
              return console.log(error);
            }
            if (currentFile === files.length) {
              console.log("All files have been copied!");
            }
          }
        );
      }
    }
  });
})();
