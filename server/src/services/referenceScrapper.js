import axios from "axios";
import * as cheerio from "cheerio";

export const scrapeReference = async (url) => {
  try {
    const { data } = await axios.get(url, {
      timeout: 12000,
    });

    const $ = cheerio.load(data);
    let content = "";

//  focus only on content main , blog , post etc
    const mainSelectors = [
      "article",
      ".post-content",
      ".entry-content",
      ".blog-content",
      "main"
    ];

    let containerFound = false;

    for (const selector of mainSelectors) {
      if ($(selector).length) {
        containerFound = true;

        $(selector)
          .find("h2, h3, p")
          .each((_, el) => {
            const text = $(el).text().trim();
            if (text.length < 40) return; 

            const tag = el.tagName.toLowerCase();
            if (tag === "p") {
              content += text + "\n\n";
            } else {
              content += "\n" + text.toUpperCase() + "\n\n";
            }
          });

        break;
      }
    }

// scanning whoile page 
    if (!containerFound) {
      $("h2, h3, p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length < 40) return;

        const tag = el.tagName.toLowerCase();
        if (tag === "p") {
          content += text + "\n\n";
        } else {
          content += "\n" + text.toUpperCase() + "\n\n";
        }
      });
    }

// validated scraped page 
    if (content.length < 800) {
      return null;
    }

    // small for free tier of gemini 
    return content.slice(0, 6000);
  } catch (err) {
   
    return null;
  }
};
