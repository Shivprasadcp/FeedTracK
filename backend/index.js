import express from "express";
import { PORT } from "./config.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import cors from 'cors';



const app = express();

app.use(express.json());
app.use(cors());
app.use('/feedback', feedbackRoutes);

app.get('/', (req, res) => {
    console.log(req.method, req.url);
    return res.status(234).send('Welcome to backend dev');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


