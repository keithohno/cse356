const crypto = require("crypto");
const db = require("./db");

exports.play = async (req, res) => {
  // error if not logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  // error if request body is missing information
  if (!("move" in req.body)) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }
  // retrieve current game from db
  let doc = await db.User.findOne({ username: req.session.user });
  let current = doc.current;
  // null move
  if (req.body.move == null) {
    res.send({ grid: current.grid, winner: " " });
    return;
  }
  // error if move is an occupied space
  if (current.grid[parseInt(req.body.move)] != " ") {
    res.send({ status: "ERROR", msg: "grid space occupied" });
    return;
  }
  // update start date
  if (!current.start_date) {
    current.start_date = new Date();
  }

  // update the grid
  // check for player win
  current.grid[parseInt(req.body.move)] = "X";
  if (check_winner(current.grid, "X")) {
    current.winner = "X";
  }

  // wopr move
  if (current.winner == " ") {
    for (let i = 0; i < 9; i += 1) {
      if (current.grid[i] == " ") {
        current.grid[i] = "O";
        break;
      }
    }
    // check for wopr win
    if (check_winner(current.grid, "O")) {
      current.winner = "O";
    }
  }

  // send response to client
  res.send({ status: "OK", grid: current.grid, winner: current.winner });

  // reset grid if necessary
  let finished = current.grid.reduce((f, v) => f && v != " ", true);
  if (current.winner != " " || finished) {
    doc.games.push(current);
    doc.current = {
      grid: [" ", " ", " ", " ", " ", " ", " ", " ", " "],
      winner: " ",
      start_date: null,
      id: crypto.randomBytes(5).toString("hex"),
    };
    if (current.winner == "X") {
      doc.stats.wins += 1;
    } else if (current.winner == "O") {
      doc.stats.losses += 1;
    } else {
      doc.stats.ties += 1;
    }
  }

  // save to mongodb
  await db.User.updateOne({ username: req.session.user }, doc);
};

function check_winner(grid, player) {
  let wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (w of wins) {
    if (
      grid[w[0]] == grid[w[1]] &&
      grid[w[1]] == grid[w[2]] &&
      grid[w[0]] == player
    ) {
      return true;
    }
  }
  return false;
}
