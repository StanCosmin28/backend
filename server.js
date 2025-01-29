const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const cors = require("cors");
// const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3000;

connectDB();
app.use(logger);

app.use(credentials);

// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// if (process.env.AWS_EXECUTION_ENV) {
//   // Running on AWS Lambda, export the app for lambda.js
//   module.exports = app;
// } else {
//   // Running locally
//   mongoose.connection.once("open", () => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   });
// }

//fix the IP bug if you're not home or in a known location
//baza de date are doar cateva adrese IP de unde poate permite requesturilor sa interogheze baza de date

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
