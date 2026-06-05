import { StatusType } from '../../../../types/all-data-types.type';
import { Division } from '../../division/interfaces/division.interface';
import { Area } from '../../area/interfaces/area.interface';

export interface Zone {
  _id?: string;
  name?: string;
  division?: Division;
  area?: Area;
  select?: boolean;
  status?: StatusType;
  priority?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
