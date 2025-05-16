const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Ta clé secrète Chatbase ici
const secret = "d16uozvt651ifzh1rv3ukwrzfdbtjo11";

app.post("/generate-user-hash", (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  const hash = crypto
    .createHmac("sha256", secret)
    .update(user_id)
    .digest("hex");

  res.json({ user_hash: hash });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Serveur Chatbase en ligne sur le port ${port}`);
});
