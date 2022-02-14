
const { CorsMiddleware } = require('./CorsMiddleware').default
const { PaginationMiddleware } = require('./PaginationMiddleware')
const { ContentTypeMiddleware } = require('./ContentTypeMiddleware')
const { ExceptionHandlerMiddleware } = require('./ExceptionHandlerMiddleware')

module.exports = [
  CorsMiddleware,
  PaginationMiddleware,
  ContentTypeMiddleware,
  ExceptionHandlerMiddleware
]