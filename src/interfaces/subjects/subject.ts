import {Document} from 'mongoose'
import { Iuser } from '../user/user';

export interface Isubject extends Document {
    name: string;
    description: string;
    studentsWhoTake: Iuser[]
}