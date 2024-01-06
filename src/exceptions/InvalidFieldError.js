export class InvalidFieldError extends Error {
  constructor(message, status = 400) {
    // Para errores de validación o sintaxis se usa el código 400, en otro caso usar el que corresponda
    super(message)
    this.name = 'InvalidFieldError'
    this.status = status
  }
}
