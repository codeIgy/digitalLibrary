import { Genre } from './genre';

export interface Book{
    _id: string,
    title: string,
    authors: string[],
    issueDate: Date,
    genre: Genre[],
    description: string,
    averageScore: number,
    imagePath: string,
    odobrena: Boolean
}