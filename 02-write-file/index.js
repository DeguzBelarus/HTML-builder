const fs = require("fs");
const path = require("path");
const readline = require("readline");

console.log("Hello!");

const output = new fs.WriteStream(path.join(__dirname, "output.txt"));
output.on("message", (message) => {
  fs.appendFile(path.join(__dirname, "output.txt"), `${message}\n`, (error) => {
    if (error) throw error;
    console.log("Your message was written down!");

    showReadline();
  });
});
output.on("error", (error) => {
  console.log(error.message);
});

process.on("exit", function () {
  console.log("\nGood bye...");
});

function showReadline(isFirstMessage = false) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  if (isFirstMessage) {
    rl.question("Enter your first message, please: ", (message) => {
      if (message === "exit") {
        output.destroy();
        return rl.close();
      }

      output.emit("message", message);
      rl.close();
    });
  } else {
    rl.question("Enter your another message, please: ", (message) => {
      if (message === "exit") {
        output.destroy();
        return rl.close();
      }

      output.emit("message", message);
      rl.close();
    });
  }
}
showReadline(true);
