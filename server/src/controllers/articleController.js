import Article from "../models/article.js";


// create blog in database 
export const createArticle = async (req, res) => {
try {
const { title, originalContent, sourceUrl } = req.body;

if (!sourceUrl) {
  return res.status(400).json({ message: "sourceUrl is required" });
}


const existing = await Article.findOne({ sourceUrl });
if (existing) {
  return res.status(409).json({ message: "Article already exists" });
}

const newArticle = new Article({
  title,
  originalContent,
  sourceUrl,
});

await newArticle.save();

res.status(201).json(newArticle);


} catch (err) {

res.status(500).json({ message: err.message });
}
};

// feteching articles 
export const getAllArticles = async (req, res) => {
try {
const articles = await Article.find()
.sort({ createdAt: -1 });

res.json(articles);


} catch (err) {
res.status(500).json({ message: err.message });
}
};

// reading single article by id 
export const getArticleById = async (req, res) => {
try {
const articleId = req.params.id;

const article = await Article.findById(articleId);

if (!article) {
  return res.status(404).json({ message: "Article not found" });
}

res.json(article);


} catch (err) {

res.status(500).json({ message: err.message });
}
};


// here we update if not updated 
export const updateArticle = async (req, res) => {
try {
const { updatedContent, references } = req.body;

const updatedArticle = await Article.findByIdAndUpdate(
  req.params.id,
  {
    updatedContent,
    references,
    isUpdated: true,
  },
  {
    new: true,
  }
);

if (!updatedArticle) {
  return res.status(404).json({ message: "Article not found" });
}

res.json(updatedArticle);


} catch (err) {

res.status(500).json({ message: err.message });
}
};

// delete if we want 
export const deleteArticle = async (req, res) => {
try {
const removed = await Article.findByIdAndDelete(req.params.id);

if (!removed) {
  return res.status(404).json({ message: "Article not found" });
}



} catch (err) {
res.status(500).json({ message: err.message });
}
};