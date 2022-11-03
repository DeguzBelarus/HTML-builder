const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

(async function () {
  try {
    const files = await readdir(path.join(__dirname, "secret-folder"), {
      withFileTypes: true,
    });

    for (const file of files) {
      const isFileDirectory = file.isDirectory();

      if (!isFileDirectory) {
        const fileName = path.parse(
          path.join(__dirname, "secret-folder", file.name)
        ).name;
        const fileExt = path.extname(
          path.join(__dirname, "secret-folder", file.name)
        );

        fs.stat(
          path.join(__dirname, "secret-folder", file.name),
          (error, stats) => {
            if (error) {
              console.log(error);
            }

            console.log(
              `${fileName} - ${fileExt.slice(1)} - ${stats.size / 1024}kb`
            );
          }
        );
      }
    }
  } catch (exception) {
    console.log(exception);
  }
})();
