import { isValidObjectId } from 'mongoose';

export const validateObjectIds = (objectIds: string[]) => {
  return objectIds.filter((objectId) => !isValidObjectId(objectId));
};
