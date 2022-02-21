exports.play = (res, req) => {
  // error if not logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  // error if request body is missing information
  if (!req.body.move) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }
  // create grid if it doesn't already exist
  if (!req.session.grid) {
    req.session.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
  }
  // null move
  if (req.body.move == null) {
    res.send({ grid: req.session.grid, winner: " " });
    return;
  }
  // error if move is an occupied space
  if (req.session.grid[parseInt(res.body.move)] != " ") {
    res.send({ status: "ERROR", msg: "grid space occupied" });
    return;
  }
  // update the grid
  else {
    req.session.grid[parseInt(res.body.move)] = "X";
    // wopr move
    for (let i = 0; i < 9; i += 1) {
      if (req.session.grid[i] == " ") {
        req.session.grid[i] = "O";
      }
    }
    // search for 3 in a row
    let winner = check_winner(req.session.grid) != " ";
    // continue the game if there are still empty slots
    if (winner == " ") {
      for (let i = 0; i < 9; i += 1) {
        if (req.session.grid[i] != " ") {
          res.send({ grid: req.session.grid, winner: " " });
          return;
        }
      }
    }
    // otherwise reset the grid
    req.session.grid = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    res.send({ grid: req.session.grid, winner: winner });
    // TODO: update mongodb
    // need to make a Game schema/model/collection thing
    // need to add list of games and winrate to the User collection
    // also i have not tested any of the code in this file so idk if it actually works
  }
};

function check_winner(grid) {
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
      grid[w[0]] != " "
    ) {
      return grid[w[0]];
    }
  }
  return " ";
}
