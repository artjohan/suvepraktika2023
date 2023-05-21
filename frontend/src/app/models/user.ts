import { Book } from './book';
import { Checkout } from './checkout';

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  favouriteBooks?: Book[];
  checkouts?: Checkout[];
}
