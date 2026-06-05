import { StatusType } from '../../../../types/all-data-types.type';
import { Division } from '../../division/interfaces/division.interface';

export interface Area {
  _id?: string;
  name?: string;
  division?: Division;
  select?: boolean;
  status?: StatusType;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
