var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const logger = require("./config/logger");
const middlewares = require("./api/middleware");
require("dotenv").config();
var ordersRouter = require("./routes/orders");
var indexRouter = require("./routes/index").default;
const apiResponse = require("./api/Support/ApiResponse");
var cors = require("cors");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//init middleware
try {
  for (const middleware of middlewares.map(
    (Middleware) => new Middleware({ logger })
  )) {
    middleware.init();
    app.use(middleware.handler());
  }
} catch (e) {
  logger.logger.info(e);
}

//Route Prefixes
app.use("/", indexRouter);
app.use("/api", ordersRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
  if (err.name == "UnauthorizedError") {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

// start server
app.listen(process.env.NODE_PORT, () =>
  console.log(`\x1b[0m[LOG] Server running on port ${process.env.NODE_PORT}`)
);

module.exports = app;
