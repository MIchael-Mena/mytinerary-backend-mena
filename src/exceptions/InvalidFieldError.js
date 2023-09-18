export class InvalidFieldError extends Error {
  constructor(message, status = 404) {
    super(message)
    this.name = 'InvalidFieldError'
    this.status = status
  }
}
