import { scrapeBeyondChatsBlogs } from "../services/beyondChatScrap.js";
import Article from "../models/article.js";
import { googleSearch } from "../services/googleSrchService.js";
import { scrapeReference } from "../services/referenceScrapper.js";
import { rewriteWithGemini } from "../services/aiService.js";

// scrapper orginal 
export const runScraper = async (req, res) => {
try {
await scrapeBeyondChatsBlogs();
res.json({ message: "Scraping completed successfully" });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// this is used to generate updated content 
export const runAIUpdate = (req, res) => {
// Fire-and-forget response

// Async IIFE so we don’t block the request lifecycle
(async () => {
try {
  const articles = await Article.find({ isUpdated: false });

  for (const article of articles) {
 
    console.log("\nProcessing:", article.title);

    // i am using google search api key to get reference
    let links = [];

    try {
      links = await googleSearch(article.title);
    } catch (err) {
      console.error(" Google search failed, skipping article");
      continue;
    }

    if (!links || links.length === 0) {
      console.warn("No Google results found");
      continue;
    }

    // scrape refernces 
    console.log("Scraping references (best effort)...");

    const ref = [];
    const validLinks = [];

    for (const link of links) {
      if (ref.length >= 2) {
        // We only need a couple of solid references
        break;
      }

      let scrapedContent;
      try {
        scrapedContent = await scrapeReference(link);
      } catch (err) {
        console.warn(" Error scraping link, skipping");
        continue;
      }

      if (!scrapedContent) {
        console.warn("Weak or blocked content");
        continue;
      }

      ref.push(scrapedContent);
      validLinks.push(link);

      console.log("Reference accepted");
    }

    if (ref.length === 0) {
      console.warn(" No usable references found, skipping article");
      continue;
    }
    //  gemini work here
    let updatedContent;

    try {
      updatedContent = await rewriteWithGemini(
        article.originalContent,
        ref[0] || "",
        ref[1] || "",
        validLinks
      );
    } catch (err) {
      console.error("Gemini rewrite failed:", err.message);
      continue;
    }

    // db update 
    article.updatedContent = updatedContent;
    article.references = validLinks;
    article.isUpdated = true;

    try {
      await article.save();
    } catch (err) {
      console.error(" Failed to save article:", err.message);
    }
  }
} catch (err) {
  // Catch-all so one bad run doesn’t crash the process
  console.error(" Automation error:", err.message);
}


})();
};