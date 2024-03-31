require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const SECRETKEY = "Athakur@6";

function validateToken(req, res, next) {
  const bearer = req.headers.authorization;
  const token = bearer.split(" ")[1];
  if (token === undefined) {
    res.status(403).json({
      msg: "invalid token",
    });
  } else {
    req.token = token;
    next();
  }
}

app.post("/profile", validateToken, (req, res) => {
  jwt.verify(req.token, SECRETKEY, (err, authData) => {
    if (err) {
      res.send({ result: "invalid token" });
    } else {
      res.json({
        msg: "profile accessed",
        authData,
      });
    }
  });
});

app.use(express.json());

app.get("/", (req, res, next) => {
  res.json({
    msg: "a simple api",
  });
});

app.post("/login", (req, res) => {
  const user = req.body.username;
  jwt.sign({ user }, SECRETKEY, { expiresIn: "300s" }, (err, token) => {
    if (err) return res.status(403).json({ msg: "error occured" });
    res.json({
      token,
    });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on http://localhost:${process.env.PORT}`);
});
