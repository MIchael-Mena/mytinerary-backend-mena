import { OAuth2Client } from 'google-auth-library'
import jsonResponse from '../utils/jsonResponse.js'
import bcrypt from 'bcrypt'

// TODO: para obtener el code, en el fornt con useGoogleLogin se debe usar la opcion flow: 'auth-code'

// Alternativa se pide el usuario con el token obtenido con el codigo de autorizacion
const getUserFromGoogleCode = async (code) => {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'postmessage',
  })

  const tokenResponse = await client.getToken(code) // La respuesta contiene los tokens el scope
  const accessToken = tokenResponse.tokens.access_token // tambien se obtiene en el front con la opcion flow: 'implicit'

  // const tokenInfo = await client.getTokenInfo(accessToken) // Util para ver los scopes

  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${accessToken}`)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
  }

  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    requestOptions
  ).then((res) => res.json())

  return response
  // Ejemplo de respuesta
  //   {
  //   sub: '1234567891234567891234', // 22 numeros id del usuario de google que se puede usar para identificarlo en la base de datos
  //   name: 'M M',
  //   given_name: 'M',
  //   family_name: 'M',
  //   picture: 'picture.jpg',
  //   email: 'mimail@gmail.com',
  //   email_verified: true,
  //   locale: 'es'
  // }
}

// Se usa el id_token (ya contiene la informacion del usuario) que se obtiene tambien con el codigo de autorizacion
const verify = async (code) => {
  const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'postmessage',
  })

  const { tokens } = await client.getToken(code)

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  return payload // Contiene azp, aud, at_hash, iat, exp y lo del anterior metodo
}

const generateBasicUser = (payload) => {
  // EL password supurara los 20 caracteres, pero no importa porque no se usa
  // en este caso el usuario se loguea con google, no con email y password
  const user = {
    password: payload.sub + process.env.SECRET_PASSWORD,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    profilePic: payload.picture,
    birthDate: null,
    country: null,
    favouriteCities: [],
    favouriteActivities: [],
    favouriteItineraries: [],
    role: 'user',
    active: true,
    online: false,
    lastLogin: null,
  }
  return user
}

const validateGoogleAuthCode = async (req, res, next) => {
  try {
    const code = req.body.code
    if (!code) return jsonResponse(false, res, 400, 'Code is required')

    const payload = await getUserFromGoogleCode(code)

    if (payload.email_verified !== true)
      return jsonResponse(
        false,
        res,
        400,
        'Please verify your email first with Google'
      )

    req.body = generateBasicUser(payload)

    next()
  } catch (error) {
    return jsonResponse(false, res, 400, 'Invalid code')
  }
}

export { validateGoogleAuthCode }
