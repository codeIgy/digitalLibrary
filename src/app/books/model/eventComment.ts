import { User } from 'src/app/auth/signup/user.model';

export interface EventComment{
    _id: string,
    author: User,
    comment: string
}