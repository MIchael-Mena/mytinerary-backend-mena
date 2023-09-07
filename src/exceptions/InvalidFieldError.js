export class InvalidFieldError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'InvalidFieldError'
    this.statusCode = statusCode
  }
}
