import { useEffect, useState } from "react";
import { fetchArticles } from "../api/blog";
import ArticleCard from "../components/card";

const Home = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then(res => setArticles(res.data));
  }, []);

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>

      <div className="grid">
        {articles.map(article => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default Home;
