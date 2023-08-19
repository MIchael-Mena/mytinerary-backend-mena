const jsonResponse = (success, res, status, message, data = null) => {
  const now = new Date()
  const options = {
    month: '2-digit',
    year: 'numeric',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }
  // @ts-ignore - Error de typescript con options por tener activo jsconfig en el proyecto
  const formatter = new Intl.DateTimeFormat('es-AR', options) // us-EN, sv-SE
  const formattedDate = formatter.format(now)

  return res.status(status).json({
    success,
    message,
    data,
    timestamp: formattedDate,
  })
}

export default jsonResponse
