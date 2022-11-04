const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

(async function () {
  const stylesDir = path.join(__dirname, "styles");
  const projectDir = path.join(__dirname, "project-dist");

  const output = new fs.WriteStream(path.join(projectDir, "bundle.css"));
  console.log("The bundle.css file has been created!\n");
  output.on("style-saving", (styleData, filename, isLastFile) => {
    fs.appendFile(
      path.join(projectDir, "bundle.css"),
      `${styleData}\n`,
      (error) => {
        if (error) return console.log(error);
        if (!isLastFile) {
          console.log(
            `Data from the file ${filename} has been saved into the bundle.css file!`
          );
        } else {
          console.log(
            `Data from the file ${filename} has been saved into the bundle.css file!\n`
          );
        }
        if (isLastFile) {
          console.log(
            "Your css bundle has been successfully created, thank you for waiting!"
          );
        }
      }
    );
  });
  output.on("error", (error) => {
    console.log(error.message);
  });

  try {
    const files = await readdir(stylesDir, {
      withFileTypes: true,
    });

    const cssFilesLength = files.filter((file) => {
      const fileExt = path.extname(path.join(stylesDir, file.name));
      if (!file.isDirectory() && fileExt.slice(1) === "css") {
        return file;
      }
    }).length;

    let fileCount = 0;
    for (const file of files) {
      let isLastFile = false;
      const isFileDirectory = file.isDirectory();
      const fileExt = path.extname(path.join(stylesDir, file.name));

      if (!isFileDirectory && fileExt.slice(1) === "css") {
        const input = new fs.ReadStream(
          path.join(stylesDir, file.name),
          "utf-8"
        );
        input.on("open", () => {
          console.log(`The ${file.name} file has been found, start reading...`);
        });
        input.on("ready", () => {
          console.log(
            `The ${file.name} file has been read, thank you for waiting!`
          );
        });
        input.on("error", (error) => {
          console.log(error.message);
        });
        input.on("data", (data) => {
          fileCount += 1;
          if (fileCount === cssFilesLength) {
            isLastFile = true;
            console.log(`Saving data from ${file.name} into bundle.css...\n`);
          } else {
            console.log(`Saving data from ${file.name} into bundle.css...`);
          }

          output.emit("style-saving", data.toString(), file.name, isLastFile);
          input.destroy();
        });
      }
    }
  } catch (exception) {
    console.log(exception);
  }
})();
