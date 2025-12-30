import axios from "axios";

const BLOCKED_DOMAINS = [
  "amazon.",
  "pinterest.",
  "facebook.",
  "instagram.",
  "linkedin.",
  "youtube.",
  "reddit."
];

export const googleSearch = async (query) => {
  const { data } = await axios.get(
    "https://www.searchapi.io/api/v1/search",
    {
      headers: {
        Authorization: `Bearer ${process.env.SERP_API_KEY}`
      },
      params: {
        engine: "google",
        q: query,
        num: 10 // fetch more candidates
      },
      timeout: 10000
    }
  );

  const results = data.organic_results || [];

  // Return MANY filtered candidates (controller will pick first 2 valid)
  return results
    .map(r => r.link)
    .filter(link => {
      if (!link) return false;
      if (link.includes("beyondchats.com")) return false;
      return !BLOCKED_DOMAINS.some(domain =>
        link.includes(domain)
      );
    })
    .slice(0, 8);
};
