export class NotFoundError extends Error {
  constructor(message, statusCode = 404) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = statusCode
  }
}
