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
    email: string;
    password: string;
    passwordConfirm: string
    courseEnrolled: string;
    subjects: Isubject[];
    role: UserRole
}