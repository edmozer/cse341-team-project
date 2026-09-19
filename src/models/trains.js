import Train from './schemas/trains.js';

export function getTrainById(id) {
  return Train.findOne({ id }).lean();
}

export function getAllTrains() {
  return Train.find({}).lean();
}
