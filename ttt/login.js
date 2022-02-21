const db = require("./db");

// login
exports.login = async (req, res) => {
  // error if already logged in as another user
  if (req.session.user) {
    res.send({ status: "ERROR", msg: "already logged in" });
    return;
  }
  // error if request body is missing information
  if (!req.body.username || !req.body.password) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }
  // search for user with given username and password
  let query = await db.User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  // error if such a user was not found
  if (!query) {
    res.send({ status: "ERROR", msg: "user not found" });
    return;
  }
  req.session.user = query.username;
  res.send({ status: "OK" });
};

// logout
exports.logout = (req, res) => {
  // error if not already logged in
  if (!req.session.user) {
    res.send({ status: "ERROR", msg: "not logged in" });
    return;
  }
  req.session.user = null;
  res.send({ status: "OK" });
};
