const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

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

async function extractSVGs(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const svgs = [];
    $("svg").each((_, svg) => {
      svgs.push($.html(svg)); // Get full inline SVG markup
    });

    return svgs;
  } catch (error) {
    console.error(`Error fetching SVGs: ${error.message}`);
    return [];
  }
}

// async function extractImagesUsingPuppeteer(url) {
//   let browser;
//   try {
//     browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });

//     // Extract image URLs
//     const imgUrls = await page.evaluate((baseUrl) => {
//       const images = new Set();
//       document.querySelectorAll("img").forEach((img) => {
//         let src = img.getAttribute("src");
//         if (src) {
//           images.add(new URL(src, baseUrl).href);
//         }
//       });
//       return [...images];
//     }, url);

//     return imgUrls;
//   } catch (error) {
//     console.error(`Failed to fetch images from ${url}: ${error.message}`);
//     return [];
//   } finally {
//     if (browser) await browser.close();
//   }
// }

async function extractImagesUsingPuppeteer(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });

    // Extract <img>, background images, and inline <svg> elements
    const allImages = await page.evaluate((baseUrl) => {
      const images = new Set();

      // Extract <img> tags
      document.querySelectorAll("img").forEach((img) => {
        if (img.src) images.add(new URL(img.src, baseUrl).href);
      });

      // Extract CSS background images
      document.querySelectorAll("*").forEach((element) => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage.startsWith("url(")) {
          const src = bgImage.match(/url\(["']?(.*?)["']?\)/)[1];
          if (src) images.add(new URL(src, baseUrl).href);
        }
      });

      // Extract inline <svg> elements
      document.querySelectorAll("svg").forEach((svg) => {
        images.add(svg.outerHTML); // Store inline SVG markup
      });

      return [...images];
    }, url);

    return allImages;
  } catch (error) {
    console.error(`Failed to fetch images from ${url}: ${error.message}`);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

async function extractBackgroundImages(url) {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });

    // Extract background images
    const bgImageUrls = await page.evaluate((baseUrl) => {
      const images = new Set();
      document.querySelectorAll("*").forEach((element) => {
        const bgImage = window.getComputedStyle(element).backgroundImage;
        if (bgImage && bgImage.startsWith("url(")) {
          // Extract the URL from `url("...")`
          const src = bgImage.match(/url\(["']?(.*?)["']?\)/)[1];
          if (src) {
            images.add(new URL(src, baseUrl).href);
          }
        }
      });
      return [...images];
    }, url);

    return bgImageUrls;
  } catch (error) {
    console.error(
      `Failed to fetch background images from ${url}: ${error.message}`
    );
    return [];
  } finally {
    if (browser) await browser.close();
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

module.exports = {
  extractImages,
  extractLinks,
  extractImagesUsingPuppeteer,
  extractBackgroundImages,
  extractSVGs,
};
