import { User } from 'src/app/auth/signup/user.model';
import { Book } from './book';

export interface Comment{
    _id: string,
    author: User,
    book: Book,
    comment: string,
    score: number
}