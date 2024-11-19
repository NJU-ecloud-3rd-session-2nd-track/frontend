import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import files from "./routes/files.js";

const PORT = 23333;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
  }),
);

app.get("/api/chat/config", (req, res) => {
  res.status(200).json({
    starterQuestions: ["谁是王亚平", "日本核污水"],
  });
});

app.get("/api/files/data/:ref_doc_id", (req, res) => {
  try {
    const refDocId = req.params.ref_doc_id;
    if (!files.has(refDocId)) {
      res.status(404).send("File not found");
      return;
    }

    res.setHeader("Content-Type", "text/plain");
    res.send(files.get(refDocId));
  } catch (err: unknown) {
    res.status(500).send("Internal Server Error");
    if (err instanceof Error) {
      console.log(err.stack);
    } else {
      console.log(err);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
