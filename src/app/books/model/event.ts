import { User } from 'src/app/auth/signup/user.model';

export interface Event{
    _id: string,
    title: string,
    start: Date,
    end: Date,
    endless: boolean,
    description: string,
    creator: User,
    type: string,
    awaiting: User[],
    participants: string[]
}