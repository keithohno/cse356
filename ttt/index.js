// express setup
const express = require("express");
const app = express();
const port = 3000;

// bodyparser
app.use(express.json());

// sessions
const session = require("express-session");
app.use(
  session({
    secret: "very secret key",
    resave: false,
    saveUninitialized: true,
  })
);

// adds X-CSE356 header to everything
app.use((req, res, next) => {
  res.setHeader("X-CSE356", "61f9c1e2ca96e9505dd3f7ea");
  next();
});

// logging
const fs = require("fs");
app.use((req, res, next) => {
  fs.writeFile(
    "./log",
    JSON.stringify(req.body, null, 2) + "\n",
    { flag: "a+" },
    (err) => {}
  );
  next();
});

// somewhat modular codebase :D
var account = require("./account");
var login = require("./login");
var ttt = require("./ttt");
var stats = require("./stats");
var db = require("./db");

app.post("/clear", db.clear);

app.post("/adduser", account.adduser);
app.post("/verify", account.verify);

app.post("/login", login.login);
app.post("/logout", login.logout);

app.post("/ttt/play", ttt.play);

app.post("/listgames", stats.list);
app.post("/getgame", stats.get);
app.post("/getscore", stats.score);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
