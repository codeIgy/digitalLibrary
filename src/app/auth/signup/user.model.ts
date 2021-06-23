import { Book } from 'src/app/books/model/book';
import { Comment } from 'src/app/books/model/comment';

export interface User{
    _id: string,
    name: string,
    lastname: string,
    username: string,
    password: string,
    date: Date,
    type: string,
    city: string,
    country: string,
    email: string,
    imagePath: string,
    read: Book[],
    isReading: Book[],
    toRead: Book[],
    alerts: Comment[],
    following: User[],
    odobren: boolean
}