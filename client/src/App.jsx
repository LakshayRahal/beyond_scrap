import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ArticleDetails from "./pages/details";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<ArticleDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
