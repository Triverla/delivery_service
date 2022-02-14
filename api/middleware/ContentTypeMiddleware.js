const logger = require('./../../config/logger');
const apiResponse = require('./../Support/ApiResponse');

class ContentTypeMiddleware {
  async init() {
    logger.logger.debug(`${this.constructor.name} initialized...`);
  }

  handler() {
    return async (req, res, next) => {
      try {
        // validate content-type
        if (["POST", "PUT", "PATCH"].includes(req.method)) {
          const contentType =
            req.headers["Content-Type"] || req.headers["content-type"];
          if (!contentType) {
            throw new apiResponse.ErrorResponse({ response: res, status: 400, message: "Content-Type header is required." });
          }

          const validContentType = ["application/json", "multipart/form-data"];
          const isValidContentType =
            contentType.includes("application/json") ||
            contentType.includes("multipart/form-data");

          if (!isValidContentType) {
            throw new apiResponse.ErrorResponse({ response: res, status: 400, message: `Invalid content type. Expect one of: [${validContentType}]` });
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}

module.exports = { ContentTypeMiddleware };
