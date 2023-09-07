// Ejemplo del endpoint: /city?sort=rating&order=desc&limit=5&page=2&search=bar
// Version Alternativa con agregación, desventaja: hace uso de countDocuments
// const getCity = async (req, res, next) => {
// const pagination = {
//   limit: 16, // Cambiar a 12 despues de actualizar front
//   page: 1,
// }
//   try {
//     const sortField = req.query.sort ? req.query.sort : 'updatedAt'
//     const sortOrder = req.query.order === 'desc' ? -1 : 1

//     const sortOptions = {
//       [sortField]: sortOrder, // Se puede agregar más de un criterio de ordenamiento
//     }

//     const limit = req.query.limit ? parseInt(req.query.limit) : pagination.limit // 0 = no limit
//     const page = req.query.page ? parseInt(req.query.page) : pagination.page // 1 = first page
//     let searchQuery = req.query.search
//       ? req.query.search.trim().toLowerCase()
//       : ''
//     let query = searchQuery
//       ? { name: { $regex: `^${searchQuery}`, $options: 'i' } } // Expresión regular de mongo
//       : {}
//     // const regex = new RegExp(`^${searchQuery}`, 'i') // Expresión regular de JS
//     // query = { name: regex }

//     const totalCitiesCount = await City.countDocuments(query)

//     const cities = await City.find(query)
//       // @ts-ignore
//       .sort(sortOptions)
//       .skip((page - 1) * limit) // Documentos a saltar
//       .limit(limit)
//       .populate({
//         path: 'itineraries',
//         populate: {
//           path: 'user',
//           select: 'name surname profilePic',
//         },
//       })

//     if (cities.length === 0)
//       return jsonResponse(
//         false,
//         res,
//         200,
//         searchQuery
//           ? `No cities found starting with '${searchQuery}'.`
//           : 'Cities not found.',
//         cities
//       )

//     const maxPage = Math.ceil(totalCitiesCount / limit)

//     jsonResponse(true, res, 200, { maxPage: maxPage.toString() }, cities)
//   } catch (error) {
//     next(error)
//   }
// }