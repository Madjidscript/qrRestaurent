var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const cors = require("cors");
const axios = require("axios");



var http = require("http");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { connection } = require("./config/mongo");
const { connectSockerServer } = require("./utils/socket-io");
connection().catch((error) => console.log("mon errerur depuis la bd", error));
var app = express();
const server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use(cors({
//   origin: 'http://localhost:7000',
//   origin1:'http://localhost:4200/',
//   origin2:'https://qrrestaux.onrender.com' 
// }));

const allowedOrigins = ['http://localhost:7000', 'http://localhost:4200', 'https://qrrestaux.onrender.com','https://qr-dashbord.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Autoriser l'accès
    } else {
      callback(new Error('Not allowed by CORS')); // Bloquer l'accès
    }
  },
}));

//configuration de ma session
app.use(
  session({
    secret: "yaya", // Une chaîne secrète pour signer les cookies de session
    resave: false, // Ne pas enregistrer la session à chaque requête
    saveUninitialized: true, // Enregistrer une session vide pour les nouveaux utilisateurs
  })
);

app.use("/admin", indexRouter);
app.use(
  "/",
  (req, res, next) => {
    console.log("mes methodes", req.url, req.method);
    next();
  },
  usersRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = connectSockerServer(server);
