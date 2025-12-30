
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api/blog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// rendering first non markdown par 
const renderArticleContent = (rawText) => {
if (!rawText) {
return null;
}

const chunks = rawText.split("\n\n"); // assuming double newlines = paragraphs

return (
<div className="article-content">
{chunks.map((chunk, idx) => {
const text = chunk.trim();

    if (!text) return null;

      // use of regex to correctly format
    const isHeading =                 
      /^\d+\./.test(text) ||        
      /^[A-Z\s]+:/.test(text);    

    if (isHeading) {
      return <h3 key={idx}>{text}</h3>;
    }

    return <p key={idx}>{text}</p>;
  })}
</div>


);
};

const ArticleDetails = () => {
const { id } = useParams(); // keeping this simple again
const [article, setArticle] = useState(null);

useEffect(() => {
let isMounted = true; // small guard in case we navigate away fast

fetchArticleById(id)
  .then((res) => {
    if (isMounted) {
      setArticle(res.data);
    }
  })
  .catch((err) => {
  });

return () => {
  isMounted = false;
};


}, [id]);

if (!article) {
return <p>Loading...</p>;
}

return (
<div className="container">
<h1>{article.title}</h1>

  <h2>Original Article</h2>
  {renderArticleContent(article.originalContent)}

  {article.isUpdated && (
    <>
      <h2>Updated Article</h2>

      <div className="article-markdown">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.updatedContent}
        </ReactMarkdown>
      </div>

      {article.references && article.references.length > 0 && (
        <>
          <h3>References</h3>
          <ul className="references">
            {article.references.map((ref, index) => (
              <li key={index}>
                <a
                  href={ref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ref}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )}
</div>


);
};

export default ArticleDetails;