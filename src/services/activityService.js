import Activity from '../models/Activity.js'
import Itinerary from '../models/Itinerary.js'
import { getItineraryByIdService } from './itineraryService.js'
import { validateId } from './util.js'
import { NotFoundError } from '../exceptions/NotFoundError.js'

const getActivityByIdService = async (activityId) => {
  validateId(activityId, 'Activity')
  const activity = await Activity.findById(activityId)
  verifyActivityExists(activityId, activity)
  return activity
}

const getActivitiesByItineraryIdService = async (itineraryId) => {
  await getItineraryByIdService(itineraryId)
  const activities = await Activity.find({ _itinerary: itineraryId })
  return activities
}

const createActivityService = async (activitiesData) => {
  // TODO: ver transacciones
  const activities = []
  for (const activityData of activitiesData) {
    const itinerary = await getItineraryByIdService(activityData._itinerary)
    const activity = await Activity.create(activityData)
    itinerary.activities.push(activity.id)
    itinerary.duration += activity.duration
    await itinerary.save()
    activities.push(activity)
  }
  return activities
}

const deleteActivityService = async (activityId) => {
  const activity = await Activity.findByIdAndDelete(activityId)
  verifyActivityExists(activityId, activity)

  await Itinerary.findByIdAndUpdate(activity._itinerary, {
    $pull: { activities: activityId },
    $inc: { duration: -activity.duration },
  })

  return activity
}

const deleteActivitiesByItineraryIdService = async (itineraryId) => {
  const itinerary = await getItineraryByIdService(itineraryId)

  const { activities } = itinerary

  if (activities.length === 0)
    throw new NotFoundError(
      'There are no activities to delete for this itinerary.'
    )

  activities.forEach(
    async (activityId) => await deleteActivityService(activityId)
  )

  return itinerary
}

const updateActivityService = async (activityId, activity) => {
  // Refactor, ver casos de uso
  const updatedActivity = await Activity.findByIdAndUpdate(
    activityId,
    activity,
    { new: true }
  )
  verifyActivityExists(activityId, updatedActivity)
  return updatedActivity
}

const verifyActivityExists = (activityId, activity) => {
  if (!activity)
    throw new NotFoundError(`Activity with id ${activityId} not found.`)
}

export {
  getActivityByIdService,
  getActivitiesByItineraryIdService,
  createActivityService,
  deleteActivityService,
  deleteActivitiesByItineraryIdService,
  updateActivityService,
}
