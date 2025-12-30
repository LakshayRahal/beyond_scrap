import express from "express";
import cors from "cors";
import articleRoutes from "./routes/articleRoute.js"
import automationRoutes from "./routes/automationRoute.js"

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/automation", automationRoutes);
app.use("/api/articles", articleRoutes);



export default app;
