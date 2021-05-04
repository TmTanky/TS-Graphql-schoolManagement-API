import mongoose from 'mongoose'

// Interfaces
import { Iuser } from '../../interfaces/user/user'

const userSchema = new mongoose.Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    password: String,
    courseEnrolled: {
        type: String || null,
        default: null
    },
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    role: String,
    instructorsSubjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
    myTickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Concern'
        }
    ]
}, { timestamps: true })

export const User = mongoose.model<Iuser>('User', userSchema)