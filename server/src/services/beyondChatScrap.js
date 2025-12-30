import axios from "axios";
import * as cheerio from "cheerio";
import Article from "../models/article.js";

const BASE_URL = "https://beyondchats.com";
const BLOGS_URL = `${BASE_URL}/blogs/`;
const REQUIRED_COUNT = 5;

export const scrapeBeyondChatsBlogs = async () => {
  try {
   

    //  this si is collecting all page urls 
    let pages = [];
    let currentUrl = BLOGS_URL;

    while (true) {
      const { data } = await axios.get(currentUrl);
      const $ = cheerio.load(data);

      pages.push(currentUrl);

      const nextLink = $("a.next").attr("href");
      if (!nextLink) break;

      currentUrl = nextLink.startsWith("http")
        ? nextLink
        : `${BASE_URL}${nextLink}`;
    }

    // Oldest articles first
    pages.reverse();

    let collected = 0;

    // articles/ blogs scrapping page wise 
    for (const pageUrl of pages) {
      if (collected >= REQUIRED_COUNT) break;

      const { data } = await axios.get(pageUrl);
      const $ = cheerio.load(data);

      const articleLinks = [];

      $("article a").each((_, el) => {
        const href = $(el).attr("href");
        if (href && href.includes("/blogs/")) {
          const fullUrl = href.startsWith("http")
            ? href
            : `${BASE_URL}${href}`;
          articleLinks.push(fullUrl);
        }
      });

      for (const articleUrl of articleLinks) {
        if (collected >= REQUIRED_COUNT) break;

        // Avoid duplicates
        const exists = await Article.findOne({ sourceUrl: articleUrl });
        if (exists) continue;

       
        // scrape each individual article one by one 
        const articlePage = await axios.get(articleUrl);
        const $$ = cheerio.load(articlePage.data);

        // Title
        const title = $$("h1").first().text().trim();
        if (!title) continue;

        // only take part of content avoid comments section
        let content = "";

        const contentDiv = $$("#content").clone();
        contentDiv.find("#comments").remove();

        contentDiv
          .find("p, h2, h3, h4, li")
          .each((_, el) => {
            const tag = el.tagName.toLowerCase();
            const text = $$(el).text().trim();

            if (!text) return;

            if (tag === "p" || tag === "li") {
              content += text + "\n\n";
            } else {
              // Headings
              content += "\n" + text.toUpperCase() + "\n\n";
            }
          });

        if (!content.trim()) continue;

        // mongo db update 
        await Article.create({
          title,
          originalContent: content,
          sourceUrl: articleUrl
        });

        collected++;
      }
    }

   
  } catch (error) {
    
  }
};
