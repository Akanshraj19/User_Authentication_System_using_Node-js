const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("views"));
app.use(morgan("dev"));
const bodyParser = require("body-parser");

const protectedRoute = require("./routes/protectedRoute");
const contact = require("./router/contact");
const dashroute = require("./router/dashroute");

const verifyToken = require("./middlewares/authMiddleware");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", contact, dashroute);
app.use("/protected", protectedRoute);

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/reset_password/:token", (req, res) => {
  const token = req.query.token;
  res.render("reset_password", { token });
});
app.get("/forget_password", (req, res) => {
  res.render("forget_password");
});
// app.get("/reset_password", (req, res) => {
//   res.render("reset_password");
// });

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.render("login");
});
app.get("/dashboard", verifyToken, (req, res) => {
  res.render("dashboard");
});
app.get("/create", verifyToken, (req, res) => {
  res.render("create");
});

const username = encodeURIComponent(process.env.Mongo_user);
const password = encodeURIComponent(process.env.Mongo_pass);
const uri = `mongodb+srv://${username}:${password}@cluster0.raql9pz.mongodb.net/`;

mongoose.connect(uri, { dbName: "Test" }).catch((err) => {
  console.log(`ERROR :${err}`);
});

mongoose.connection.on("connected", () => {
  console.log("Database connected");
});

const port = 4000;
app.listen(port, () => {
  console.log("Server is working on http://localhost:4000");
});
