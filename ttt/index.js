// express setup
const express = require("express");
const app = express();
const port = 3000;

// bodyparser
app.use(express.urlencoded({ extended: true }));

// sessions
const session = require("express-session");
app.use(
  session({
    secret: "very secret key",
    resave: false,
    saveUninitialized: false,
  })
);

// somewhat modular codebase :D
var account = require("./account");
var login = require("./login");
var ttt = require("./ttt");

// adds X-CSE356 header to everything
app.use((req, res, next) => {
  res.setHeader("X-CSE356", "61f9c1e2ca96e9505dd3f7ea");
  next();
});

app.post("/adduser", account.adduser);
app.post("/verify", account.verify);
app.post("/clear", account.clear);

app.post("/login", login.login);
app.post("/logout", login.logout);

app.post("/ttt/play", ttt.play);

// /listgames
// to get { status:"OK", games:[ {id:, start_date:}, …] }

// /getgame, { id: }
// to get { status:"OK", grid:["X","O",…], winner:"X" }

// /getscore
// to get { status:"OK", human:0, wopr: 5, tie: 10 }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
