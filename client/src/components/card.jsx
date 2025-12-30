import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  return (
    <div className="card">
      <h3>{article.title}</h3>

      <span className={article.isUpdated ? "badge green" : "badge"}>
        {article.isUpdated ? "Updated" : "Original"}
      </span>

      <Link to={`/article/${article._id}`}>
        <button className="butt">View</button>
      </Link>
    </div>
  );
};

export default ArticleCard;
