const getPagination = (query) => {
  const defaultPagination = { limit: 9, page: 1 }
  const limit = query.limit ? parseInt(query.limit) : defaultPagination.limit
  const page = query.page ? parseInt(query.page) : defaultPagination.page
  return { limit, page }
}

const getSortOptions = (query) => {
  const sortField = query.sort || 'updatedAt' // Si no se especifica el campo por el que se quiere ordenar, se ordena por fecha de actualización
  const sortOrder = query.order === 'desc' ? -1 : 1
  return { [sortField]: sortOrder }
}

const getQueryOptions = (query) => {
  const searchQuery = query.search ? query.search.trim().toLowerCase() : ''
  const queryToFind = searchQuery
    ? { name: { $regex: `^${searchQuery}`, $options: 'i' } }
    : {}
  return { ...getPagination(query), queryToFind }
}

const buildAggregationPipeline = (
  queryToFind,
  sortOptions,
  page,
  limit,
  lookup = null,
  unwind = null,
  project = null
) => {
  const pipeline = []
  // El orden es importante
  pipeline.push({ $match: queryToFind })

  if (lookup) {
    pipeline.push(lookup)
  }

  if (unwind) {
    pipeline.push(unwind)
  }

  if (project) {
    pipeline.push(project)
  }

  pipeline.push({ $sort: sortOptions })

  pipeline.push({
    $facet: {
      results: [{ $skip: (page - 1) * limit }, { $limit: limit }], // Paginación
      totalCount: [{ $count: 'count' }],
    },
  })

  return pipeline
}

export {
  getPagination,
  getSortOptions,
  getQueryOptions,
  buildAggregationPipeline,
}
