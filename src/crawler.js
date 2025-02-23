const { extractImages, extractLinks } = require("./parser");
const { saveImage } = require("./downloader");

async function crawl(startUrl, maxDepth) {
  let visited = new Set();
  let queue = [{ url: startUrl, depth: 1 }]; // Start at depth 1

  while (queue.length > 0) {
    const { url, depth } = queue.shift();
    if (visited.has(url) || depth > maxDepth) continue;

    visited.add(url);
    console.log(`Crawling: ${url} (Depth ${depth})`);

    // Extract and download images from the page
    const images = await extractImages(url);
    for (const imgUrl of images) {
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
