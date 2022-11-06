const fs = require("fs");
const path = require("path");
const { readdir } = require("fs/promises");

(async function () {
  try {
    const destinationPath = path.join(__dirname, "project-dist");
    const stylesDir = path.join(__dirname, "styles");
    const assetsDir = path.join(__dirname, "assets");
    const templateHTMLDir = path.join(__dirname);
    const componentsDir = path.join(__dirname, "components");

    fs.mkdir(destinationPath, { recursive: true }, (error) => {
      console.log("Creating a project-dist folder...");
      if (error) {
        return console.log(error);
      }
      console.log("The project-dist folder has been created!\n");
    });

    const outputHTML = new fs.WriteStream(
      path.join(destinationPath, "index.html")
    );
    outputHTML.on("html-saving", (htmlLine) => {
      fs.appendFile(
        path.join(destinationPath, "index.html"),
        htmlLine,
        (error) => {
          if (error) return console.log(error);
          console.log(
            "index.html bundle has been successfully created! Enjoy it!"
          );
        }
      );
    });
    const outputCSS = new fs.WriteStream(
      path.join(destinationPath, "style.css")
    );

    outputCSS.on("style-saving", (styleData, filename, isLastFile) => {
      fs.appendFile(
        path.join(destinationPath, "style.css"),
        `${styleData}\n`,
        (error) => {
          if (error) return console.log(error);
          if (!isLastFile) {
            console.log(
              `Data from the file ${filename} has been saved into the style.css file!`
            );
          } else {
            console.log(
              `Data from the file ${filename} has been saved into the style.css file!\n`
            );
          }
          if (isLastFile) {
            console.log(
              "Your css bundle (the style.css file) has been successfully created, thank you for waiting!\n"
            );
          }
        }
      );
    });
    outputCSS.on("error", (error) => {
      console.log(error.message);
    });

    // CSS bundling
    const filesCSS = await readdir(stylesDir, {
      withFileTypes: true,
    });
    const cssFilesLength = filesCSS.filter((file) => {
      const fileExt = path.extname(path.join(stylesDir, file.name));
      if (!file.isDirectory() && fileExt.slice(1) === "css") {
        return file;
      }
    }).length;

    let fileCSSCount = 0;
    console.log("Creating the style.css file bundle has been started...\n");
    for (const fileCSS of filesCSS) {
      let isLastFile = false;
      const isFileDirectory = fileCSS.isDirectory();
      const fileExt = path.extname(path.join(stylesDir, fileCSS.name));

      if (!isFileDirectory && fileExt.slice(1) === "css") {
        const input = new fs.ReadStream(
          path.join(stylesDir, fileCSS.name),
          "utf-8"
        );
        input.on("open", () => {
          console.log(
            `The ${fileCSS.name} file has been found, start reading...`
          );
        });
        input.on("ready", () => {
          console.log(
            `The ${fileCSS.name} file has been read, thank you for waiting!`
          );
        });
        input.on("error", (error) => {
          console.log(error.message);
        });
        input.on("data", (data) => {
          fileCSSCount += 1;
          if (fileCSSCount === cssFilesLength) {
            isLastFile = true;
            console.log(
              `Saving data from ${fileCSS.name} into bundle.css...\n`
            );
          } else {
            console.log(`Saving data from ${fileCSS.name} into bundle.css...`);
          }

          outputCSS.emit(
            "style-saving",
            data.toString(),
            fileCSS.name,
            isLastFile
          );
          input.destroy();
        });
      }
    }
    // CSS bundling

    // assets copying
    const filesAssets = await readdir(assetsDir, {
      withFileTypes: true,
    });

    async function copyFolder(folderData) {
      fs.mkdir(
        path.join(destinationPath, "assets", folderData.name),
        { recursive: true },
        (error) => {
          console.log(`Creating the folder ${folderData.name} for assets...`);
          if (error) {
            return console.log(error);
          }
          console.log(`The ${folderData.name} folder has been created!`);
        }
      );

      const folderFiles = await readdir(path.join(assetsDir, folderData.name), {
        withFileTypes: true,
      });

      let currentFile = 0;
      for (const file of folderFiles) {
        fs.copyFile(
          path.join(assetsDir, folderData.name, file.name),
          path.join(destinationPath, "assets", folderData.name, file.name),
          (error) => {
            currentFile++;
            console.log(`Copying a file ${file.name}...`);
            if (error) {
              return console.log(error);
            }
            if (currentFile === folderFiles.length) {
              console.log(
                `All assets files from the ${folderData.name} folder have been copied!`
              );
            }
          }
        );
      }
    }

    fs.mkdir(
      path.join(destinationPath, "assets"),
      { recursive: true },
      (error) => {
        console.log(`Creating a folder assets...`);
        if (error) {
          return console.log(error);
        }
        console.log(`The assets folder has been created!\n`);
      }
    );

    let currentFile = 0;
    for (const fileAssets of filesAssets) {
      const isFileDirectory = fileAssets.isDirectory();

      if (!isFileDirectory) {
        fs.copyFile(
          path.join(assetsDir, fileAssets.name),
          path.join(destinationPath, "assets", fileAssets.name),
          (error) => {
            currentFile++;
            console.log(`Copying a file ${fileAssets.name}...`);
            if (error) {
              return console.log(error);
            }
            if (currentFile === filesAssets.length) {
              console.log("All files have been copied!");
            }
          }
        );
      } else {
        copyFolder(fileAssets);
      }
    }
    // assets copying

    // bundling HTML
    const filesComponents = await readdir(componentsDir, {
      withFileTypes: true,
    });
    const filesComponentsHTMLOnly = filesComponents.filter((file) => {
      const fileExt = path.extname(path.join(componentsDir, file.name));
      if (!file.isDirectory() && fileExt.slice(1) === "html") {
        return file;
      }
    });

    let dataHTML;
    const templateHTMLIput = new fs.ReadStream(
      path.join(templateHTMLDir, "template.html")
    );
    templateHTMLIput.on("open", () => {
      console.log(`The template.html file has been found, start reading...`);
    });
    templateHTMLIput.on("ready", () => {
      console.log(
        `The template.html file has been read, thank you for waiting!`
      );
    });
    templateHTMLIput.on("error", (error) => {
      console.log(error.message);
    });
    templateHTMLIput.on("data", (data) => {
      dataHTML = data.toString().split("\n");
    });
    templateHTMLIput.on("end", () => {
      let componentCount = 0;
      let componentsData = {};
      filesComponentsHTMLOnly.forEach((component) => {
        const input = new fs.ReadStream(
          path.join(componentsDir, component.name),
          "utf-8"
        );
        input.on("open", () => {
          console.log(
            `The ${component.name} file has been found, start reading...`
          );
        });
        input.on("ready", () => {
          console.log(
            `The ${component.name} file has been read, thank you for waiting!`
          );
        });
        input.on("error", (error) => {
          console.log(error.message);
        });
        input.on("data", (data) => {
          componentsData[component.name.split(".")[0]] = data;
        });
        input.on("end", () => {
          componentCount++;
          input.destroy();
          if (componentCount === filesComponentsHTMLOnly.length) {
            dataHTML = dataHTML.map((lineHTML) => {
              if (
                lineHTML.includes("{{") &&
                lineHTML.includes("}}") &&
                !lineHTML.includes("<!--") &&
                !lineHTML.includes("-->")
              ) {
                for (const component in componentsData) {
                  if (lineHTML.includes(component)) {
                    const spacesHTML = lineHTML.search(/\S/);
                    componentsData[component] = componentsData[component]
                      .toString()
                      .split("\n")
                      .map((componentLine) => {
                        return `${" ".repeat(spacesHTML)}${componentLine}`;
                      })
                      .join("\n");

                    return `${componentsData[component]}`;
                  }
                }
              } else {
                return lineHTML;
              }
            });

            dataHTML = dataHTML.join("\n");
            outputHTML.emit("html-saving", dataHTML);
          }
        });
      });
    });
    // bundling HTML
  } catch (exception) {
    console.log(exception);
  }
})();
