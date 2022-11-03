const fs = require("fs");
const path = require("path");

const input = new fs.ReadStream(path.join(__dirname, "text.txt"), "utf-8");
input.on("open", () => {
  console.log("The text.txt file was found, start reading...");
});
input.on("ready", () => {
  console.log("The text.txt file was read, thank you for waiting!");
});
input.on("data", (data) => {
  console.log(`The text.txt file content: ${data.toString()}`);
});
input.on("end", () => {
  console.log("Good bye...");
});
input.on("error", (error) => {
  console.log(error.message);
});
