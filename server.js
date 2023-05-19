const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3500;
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whitelist = [
  "https://www.google.com",
  "https://www.yoursiteOrYourDomainFromFE.com",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    //set to no origin(!origin) only in DEV MODE!!
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// built-in middleware to handle URL encoded data
// in other words, form data:
// "content-type: application/x-www-form-urlencoded"
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  //res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "new-page.html");
});

//_Route handlers_S
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("Attempt to load hello.html");
    next();
  },
  (req, res) => {
    res.send("Hello World!");
  }
);
//_Route handlers_E

//_Chaining Route Handlers_S
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res, next) => {
  res.send("finished");
};
app.get("/chain(.html)?", [one, two, three]);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found!" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
