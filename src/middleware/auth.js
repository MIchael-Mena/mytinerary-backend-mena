import bcrypt from 'bcrypt'
import jsonResponse from '../utils/jsonResponse.js'
import { userDetailSchema, userLoginSchema } from '../models/UserValidation.js'
import jwt from 'jsonwebtoken'
import { getUserByEmailService } from '../services/userService.js'
import { Strategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'

const validateUserDataRegister = async (req, res, next) => {
  const payload = req.body
  const userValidation = userDetailSchema.validate(payload, {
    abortEarly: false,
    dateFormat: 'date',
  })

  if (userValidation.error)
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )

  // Reemplazo el body por el validado que incluye los valores por defecto
  req.body = userValidation.value

  next()
}

const validateUserDataLogin = async (req, res, next) => {
  const payload = req.body
  const userValidation = userLoginSchema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (userValidation.error)
    return jsonResponse(
      false,
      res,
      400,
      userValidation.error.details.map((error) => error.message)
    )

  next()
}

const hashPassword = (req, res, next) => {
  try {
    const passwordPlain = req.body.password
    const hashPassword = bcrypt.hashSync(passwordPlain, 10)

    req.body.password = hashPassword

    next()
  } catch (error) {
    jsonResponse(false, res, 500, 'Error hashing password')
  }
}

const checkEmailDuplicate = async (req, res, next) => {
  try {
    await getUserByEmailService(req.body.email) // Da un error si no existe el email
    return jsonResponse(false, res, 403, 'Email already exists')
  } catch (error) {
    next()
  }
}

const checkUserExists = async (req, res, next) => {
  try {
    req.user = await getUserByEmailService(req.body.email)
    next()
  } catch (error) {
    return jsonResponse(false, res, 404, `User not found`)
  }
}

const verifiyPassword = (req, res, next) => {
  const passwordPlain = req.body.password
  const hashPassword = req.user.password
  const isPasswordValid = bcrypt.compareSync(passwordPlain, hashPassword)

  if (!isPasswordValid) {
    // return jsonResponse(
    //   false,
    //   res,
    //   404,
    //   `User with email '${req.body.email}' not found`
    //   )
    return jsonResponse(false, res, 400, 'Password not valid')
  }

  next()
}

// TODO: el body contiene los datos que el usuario completó en el formulario de login
const generateToken = (req, res, next) => {
  try {
    const email = req.user ? req.user.email : req.body ? req.body.email : null
    if (!email) return jsonResponse(false, res, 500, 'Email not found')
    req.token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    })
    next()
  } catch (error) {
    return jsonResponse(false, res, 500, 'Error generating token')
  }
}

const passportJwtAuthentication = passport.use(
  new Strategy(
    {
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Si el token fue modificado, o no existe, o no es válido, o el secret es invalido, no se ejecuta el callback
    },
    async (payload, done) => {
      try {
        const user = await getUserByEmailService(payload.email)
        // Si el usuario no está online o no está activo, no se ejecuta el callback, y se devuelve un error 401
        if (!user.online || !user.active) return done(null, false)

        return done(null, user) // Con esto passport guarda el usuario en req.user
      } catch (error) {
        // return done(error instanceof NotFoundError ? null : error)
        return done(error)
      }
    }
  )
)
/* 
  Middleware para validar el rol del usuario, y autorizar el acceso a una ruta 
  roles: [ 'admin', 'user' ]
*/
const validateUserRole = (roles) => {
  // roles puede ser un arrray de roles, o un solo rol
  roles = Array.isArray(roles) ? roles : [roles]
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return jsonResponse(false, res, 403, 'Unauthorized')
    }
    next()
  }
}

export {
  hashPassword,
  verifiyPassword,
  validateUserDataRegister,
  validateUserDataLogin,
  checkUserExists,
  generateToken,
  checkEmailDuplicate,
  passportJwtAuthentication,
  validateUserRole,
}
