

🕷️ Web Crawler - Image Downloader
A simple CLI-based web crawler that downloads images from a webpage and its child pages up to a specified depth.

📌 Features 
1) Crawls a webpage and extracts all images.
2) Recursively crawls child pages up to the given depth.
3) Saves downloaded images in an images/ folder.
4) Creates an index.json file to track all collected images and their sources.
5) Uses BFS traversal for structured crawling.

🚀 Installation 1) Clone the Repository:
git clone <repo_url>
cd web-crawler

    1) Clone the Repository:
        git clone <repo_url>
        cd web-crawler
        
    2) Install Dependencies:
        npm install

    3) Make the CLI Executable:
        chmod +x bin/cli.js

    4) Link the CLI (Optional - for system-wide use):
        npm link


🛠️ Example Usage


    crawl https://example.com 2

    <<RESULT>>
    Crawls https://example.com (depth 1).
    Crawls all linked pages from the main page (depth 2).
    Downloads all images found on these pages.

📝 Output Structure
Downloaded images are saved in the images/ directory.
Metadata is stored in images/index.json,

