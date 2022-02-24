const db = require("./db");

exports.list = async (req, res) => {
  // error if not logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  let user = await db.User.findOne({ username: req.session.user });
  res.send({ status: "OK", games: user.games });
};

exports.get = async (req, res) => {
  // error if not logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  // error if request body is missing information
  if (!("id" in req.body)) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }

  let user = await db.User.findOne({ username: req.session.user });
  let game = user.games.filter((x) => x.id == req.body.id)[0];
  res.send({
    status: "OK",
    grid: game.grid,
    winner: game.winner,
  });
};

exports.score = async (req, res) => {
  // error if not logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  let user = await db.User.findOne({ username: req.session.user });
  res.send({
    status: "OK",
    human: user.stats.wins,
    wopr: user.stats.losses,
    tie: user.stats.ties,
  });
};
