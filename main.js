import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("*", (req, res) => {
  res.send(`{"msg": "hello"}\n`);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
