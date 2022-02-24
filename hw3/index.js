// express setup
const express = require("express");
const app = express();
app.use(express.json());

// adds X-CSE356 header to everything
app.use((req, res, next) => {
  res.setHeader("X-CSE356", "61f4987cee02ae72472416bb");
  next();
});

// routes
const listen = require("./listen");
const speak = require("./speak");
app.post("/listen", listen.rabbit);
app.post("/speak", speak.rabbit);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
