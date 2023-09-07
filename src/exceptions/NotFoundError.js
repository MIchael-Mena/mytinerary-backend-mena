export class NotFoundError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = statusCode
  }
}
