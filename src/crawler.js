const {
  extractImages,
  extractLinks,
  extractImagesUsingPuppeteer,
  extractBackgroundImages,
  extractSVGs,
} = require("./parser");
const { saveImage } = require("./downloader");

const fs = require("fs");
const path = require("path");

const INDEX_FILE = path.join(__dirname, "../images");

const clearImagesFolder = () => {
  if (fs.existsSync(INDEX_FILE)) {
    fs.rmSync(INDEX_FILE, { recursive: true, force: true });
    console.log("Removed existing 'images'");
  }
  fs.mkdirSync(INDEX_FILE, { recursive: true });
};

async function crawl(startUrl, maxDepth) {
  clearImagesFolder();
  let visited = new Set();
  let queue = [{ url: startUrl, depth: 1 }]; // Start at depth 1

  while (queue.length > 0) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > maxDepth) continue;

    visited.add(url);
    console.log(`Crawling: ${url} (Depth ${depth})`);

    // Extract and download images from the page
    const images1 = await extractImages(url);
    const images2 = await extractImagesUsingPuppeteer(url);
    const images3 = await extractBackgroundImages(url);
    const svgs = await extractSVGs(url);
    for (const imgUrl of [...images1, ...images2, ...images3, ...svgs]) {
      await saveImage(imgUrl, url, depth);
    }

    // Stop if we've reached max depth
    if (depth < maxDepth) {
      const links = await extractLinks(url);
      for (const link of links) {
        if (!visited.has(link)) {
          queue.push({ url: link, depth: depth + 1 });
        }
      }
    }
  }
}

module.exports = { crawl };
