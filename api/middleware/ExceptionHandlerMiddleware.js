const { logger } = require("../../config/logger");

function ExceptionHandlerMiddleware(error, req, res, next) {
  let { status = 500, message, data } = error;

  message = status === 500 || !message ? "Internal server error" : message;

  error = {
    type: "error",
    status,
    message,
    ...(data && data),
  };

  res.status(status).send(error);
}

module.exports = { ExceptionHandlerMiddleware };
