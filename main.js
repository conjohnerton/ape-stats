import express from "express";
import snw from "snoowrap";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import reddisLib from "redis";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join("client/build")));
dotenv.config();

const redis = reddisLib.createClient({ url: "redis://redis:6379" });
redis
  .on("connect", () => {
    console.log("Connected to redis...");
    // redis.del(process.env.testAccount);
    redis.hset(process.env.testAccount, [
      "username",
      process.env.testAccount,
      "stack",
      "48",
    ]);
    redis.hset("totalSilverCount", ["total", 48]);
  })
  .on("error", (err) => {
    console.log(err);
  });

const r = new snw({
  userAgent: `ape-stats by ${process.env.testAccount}`,
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  refreshToken: process.env.refreshToken,
  accessToken: process.env.accessToken,
});

app.get("/apes/numApes", async (_, res) => {
  const a = await r.getSubreddit("wallstreetsilver").subscribers;
  res.send({ apes: a });
});

app.get("/apes/:id", async (req, res) => {
  const { id } = req.params;
  redis.hgetall(id, (err, obj) => {
    if (err) {
      res.send({ error: "There was an issue on the servers side" });
      return;
    }

    if (!obj) {
      res.send({ msg: `User ${id} has no known stack` });
      return;
    }

    res.send(obj);
  });
});

app.get("/silver", (req, res) => {
  redis.hgetall("totalSilverCount", (err, obj) => {
    if (err) {
      res.send({ error: "There was an issue on the servers side" });
      return;
    }

    if (!obj) {
      res.send({ total: "0" });
      return;
    }

    res.send(obj);
  });
});

app.post("/silver", (req, res) => {});

// Delivers the initial index.html for React to manipulate
app.get("*", (_, res) => {
  res.sendFile(path.join("/client/build/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));
