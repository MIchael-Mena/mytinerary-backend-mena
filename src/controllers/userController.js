const getActiveUsers = async (req, res, next) => {
  try {
    // const users = await getActiveUsersService()
    // jsonResponse(true, res, 200, 'Users retrieved successfully.', users)
  } catch (error) {
    next(error)
  }
}

const getInactiveUsers = async (req, res, next) => {}

const getOnlineUsers = async (req, res, next) => {}

const getOfflineUsers = async (req, res, next) => {}

const getUserById = async (req, res, next) => {}

export {
  getActiveUsers,
  getInactiveUsers,
  getOnlineUsers,
  getOfflineUsers,
  getUserById,
}
