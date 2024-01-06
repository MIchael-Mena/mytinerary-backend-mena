import {
  createActivityService,
  deleteActivitiesByItineraryIdService,
  deleteActivityService,
  getActivitiesByItineraryIdService,
  getActivityByIdService,
  updateActivityService,
} from '../services/activityService.js'
import jsonResponse from '../utils/jsonResponse.js'

const getActivityById = async (req, res, next) => {
  try {
    const activityId = req.params.id
    const activity = await getActivityByIdService(activityId)
    jsonResponse(true, res, 200, 'Activity found.', activity)
  } catch (error) {
    next(error)
  }
}

const getActivitiesByItineraryId = async (req, res, next) => {
  try {
    const activities = await getActivitiesByItineraryIdService(
      req.params.itineraryId
    )
    jsonResponse(true, res, 200, 'Activities found.', activities)
  } catch (error) {
    next(error)
  }
}

const createActivities = async (req, res, next) => {
  try {
    const isArrayOfActivities = Array.isArray(req.body)
    const activitiesData = isArrayOfActivities ? req.body : [req.body]
    const activity = await createActivityService(activitiesData)
    jsonResponse(
      true,
      res,
      200,
      isArrayOfActivities ? 'Activities created.' : 'Activity created.',
      activity
    )
  } catch (error) {
    next(error)
  }
}

const deleteActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id
    const activity = await deleteActivityService(activityId)
    jsonResponse(true, res, 200, 'Activity deleted.', activity)
  } catch (error) {
    next(error)
  }
}

const deleteActivitiesByItineraryId = async (req, res, next) => {
  try {
    const itineraryId = req.params.itineraryId
    const itinerary = await deleteActivitiesByItineraryIdService(itineraryId)
    jsonResponse(
      true,
      res,
      200,
      'Activities deleted successfully.',
      itinerary.activities
    )
  } catch (error) {
    next(error)
  }
}

const updateActivity = async (req, res, next) => {
  try {
    const activityId = req.params.id
    const activity = await updateActivityService(activityId, req.body)
    jsonResponse(true, res, 200, 'Activity updated.', activity)
  } catch (error) {
    next(error)
  }
}

export {
  getActivityById,
  getActivitiesByItineraryId,
  createActivities,
  deleteActivity,
  updateActivity,
  deleteActivitiesByItineraryId,
}
