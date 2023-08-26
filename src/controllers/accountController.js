import Account from '../models/Account.js'
import User from '../models/User.js'

const addAccount = async (req, res) => {
  try {
    let { userId, number } = req.query

    let user = await User.findById(userId)

    let newAccount = await Account.create({
      number: number,
      _user: user,
    })

    await user.updateOne({
      accounts: [...user.accounts, newAccount],
    }) // Actualiza el usuario con la nueva cuenta, pero no devuelve el usuario actualizado

    let userUpdated = await User.findById(userId).populate('accounts')

    res
      .status(200)
      .json({ message: 'Account created successfully', user: userUpdated })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}

export { addAccount }
