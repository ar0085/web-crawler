const fs = require("fs");
const path = require("path");

const INDEX_FILE = path.join(__dirname, "../images/index.json");

function updateIndex(imageUrl, refererUrl, depth) {
  let indexData = { images: [], count: 0 };

  let countToSet = 0;

  if (fs.existsSync(INDEX_FILE)) {
    indexData = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
    countToSet = indexData.images.length;
  }

  indexData.images.push({ url: imageUrl, page: refererUrl, depth });
  indexData.count = indexData.count + 1;

  fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 4));
}

module.exports = { updateIndex };
