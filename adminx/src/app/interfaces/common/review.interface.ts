import {User} from './user.interface';
import {Product} from './product.interface';


export interface Review {
  _id?: string;
  user?: string | User;
  product?: any;
  name?: string;
  reviewrname?: string;
  reviewDate: string;
  review: string;
  rating: number;
  ratingDone?: number[];
  ratingDue?: number[];
  status: boolean;
  reply: string;
  replyDate: string;
  like: number;
  dislike: number;
  images: string[];
  select?: boolean;
}
