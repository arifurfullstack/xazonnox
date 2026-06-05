import { StatusType } from '../../../../types/all-data-types.type';

export interface Division {
  _id?: string;
  name?: string;
  select?: boolean;
  status?: StatusType;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
