const fs = require("fs");
const path = require("path");

const deletePath = path.join(__dirname, "../es");

try {
  fs.rmdirSync(deletePath, { recursive: true });
} catch (err) {}
