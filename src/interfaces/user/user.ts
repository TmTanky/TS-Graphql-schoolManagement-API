import {Document} from 'mongoose'
import { Isubject } from '../subjects/subject';

export enum UserRole {
    ADMIN = "admin",
    TEACHER = "teacher",
    STUDENT = "student"
}

export interface Iuser extends Document {
    firstName: string;
    middleName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    courseEnrolled: string;
    subjects: Isubject[];
    role: UserRole
}