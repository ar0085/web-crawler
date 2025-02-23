const fs = require("fs");
const path = require("path");

const INDEX_FILE = path.join(__dirname, "../images/index.json");

function updateIndex(imageUrl, refererUrl, depth) {
  let indexData = { images: [] };

  if (fs.existsSync(INDEX_FILE)) {
    indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
  }

  indexData.images.push({ url: imageUrl, page: refererUrl, depth });

  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 4));
}

module.exports = { updateIndex };
