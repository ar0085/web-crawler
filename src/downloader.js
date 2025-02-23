const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { updateIndex } = require("./utils");
const { URL } = require("url");

// Directory to store images
const IMAGE_DIR = path.join(__dirname, "../images");
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function saveImage(imageUrl, refererUrl, depth) {
  try {
    const response = await axios({
      url: imageUrl,
      responseType: "stream",
      timeout: 10000,
    });

    const filename = path.basename(new URL(imageUrl).pathname);
    const filepath = path.join(IMAGE_DIR, filename);

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    updateIndex(imageUrl, refererUrl, depth);
    console.log(`Downloaded: ${imageUrl}`);
  } catch (error) {
    console.log(`Failed to download ${imageUrl}: ${error.message}`);
  }
}

module.exports = { saveImage };
