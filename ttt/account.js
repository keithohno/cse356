const nodemailer = require("nodemailer");
const crypto = require("crypto");
const db = require("./db");

// check if user with give username or email already exist in the database
async function user_exists(username, email) {
  if (
    await db.UserDisabled.findOne({
      $or: [{ email: email }, { username: username }],
    })
  ) {
    return true;
  }
  if (
    await db.User.findOne({
      $or: [{ email: email }, { username: username }],
    })
  ) {
    return true;
  }
  return false;
}

// adduser route
exports.adduser = async (req, res) => {
  // error if request body is missing information
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }
  // error if user already exists
  if (await user_exists(req.body.username, req.body.email)) {
    res.send({ status: "ERROR", msg: "username/email already taken" });
    return;
  }
  // generate verification string
  let key = crypto.randomBytes(5).toString("hex");
  // create mongodb user
  let newuser = new db.UserDisabled({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    key: key,
  });
  await newuser.save();
  // send key as an email
  await send_verification(req.body.email, key);
  res.send({ status: "OK" });
};

// verificaiton emailer
async function send_verification(email, key) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "cse356.noreply",
      pass: "verondrew",
    },
  });
  await transporter.sendMail({
    from: "cse356_noreply",
    to: email,
    subject: "Verify Email",
    text: key,
  });
}

// verify a disabled user with a key
exports.verify = async (req, res) => {
  // error if request body is missing information
  if (!req.body.email || !req.body.key) {
    res.send({ status: "ERROR", msg: "missing info" });
    return;
  }
  // run query
  // don't filter by key if backdoor key is provided
  let filter = {
    email: req.body.email,
  };
  if (req.body.key != "abracabra") {
    filter.key = req.body.key;
  }
  let query = await db.UserDisabled.findOne(filter);
  // error if such a user was not found
  if (!query) {
    res.send({ status: "ERROR", msg: "user/key not found" });
    return;
  }
  // copy data to User collection
  let newuser = new db.User({
    username: query.username,
    password: query.password,
    email: query.email,
  });
  await newuser.save();
  // delete data from UserDisabled collection
  await db.UserDisabled.deleteOne({
    email: req.body.email,
    key: req.body.key,
  });
  res.send({ status: "OK" });
};

// clear database content
exports.clear = async (req, res) => {
  await db.User.deleteMany({});
  await db.UserDisabled.deleteMany({});
  res.send({ status: "OK" });
};
