import axios from "axios";

const API = axios.create({
  baseURL: "https://beyond-scrap.onrender.com/api"
});

export const fetchArticles = () => API.get("/articles");
export const fetchArticleById = (id) => API.get(`/articles/${id}`);
