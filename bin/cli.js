#!/usr/bin/env node
const { crawl } = require("../src/crawler");

if (process.argv.length !== 4) {
  console.error("Usage: crawl <start_url> <depth>");
  process.exit(1);
}

const startUrl = process.argv[2];
const depth = parseInt(process.argv[3], 10);

if (isNaN(depth) || depth < 1) {
  console.error("Error: Depth must be a positive integer.");
  process.exit(1);
}

crawl(startUrl, depth).then(() => console.log("Crawling complete!"));
