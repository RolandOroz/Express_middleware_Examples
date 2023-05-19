const express = require("express");
const path = require("path");
const app = express();

//*_Server setup_S
const PORT = process.env.PORT || 3500;

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
//_Chaining Route Handlers_E

app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
