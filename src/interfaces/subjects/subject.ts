import {Document} from 'mongoose'
import { Iuser } from '../user/user';

export interface Isubject extends Document {
    name: string
    description: string
    instructor: Iuser
    studentsWhoTake: Iuser[]
}