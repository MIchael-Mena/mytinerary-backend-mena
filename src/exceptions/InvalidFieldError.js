export class InvalidFieldError extends Error {
  constructor(message, statusCode = 404) {
    super(message)
    this.name = 'InvalidFieldError'
    this.statusCode = statusCode
  }
}
