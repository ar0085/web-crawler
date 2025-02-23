const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

async function extractImages(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    let imgUrls = new Set();
    $("img").each((_, img) => {
      let src = $(img).attr("src");
      if (src) {
        imgUrls.add(new URL(src, url).href);
      }
    });

    return [...imgUrls];
  } catch (error) {
    console.log(`Failed to fetch images from ${url}: ${error.message}`);
    return [];
  }
}

async function extractLinks(url) {
  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(data);

    let links = new Set();
    $("a").each((_, a) => {
      let href = $(a).attr("href");
      if (href) {
        links.add(new URL(href, url).href);
      }
    });

    return [...links];
  } catch (error) {
    console.log(`Failed to fetch links from ${url}: ${error.message}`);
    return [];
  }
}

module.exports = { extractImages, extractLinks };
