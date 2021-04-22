import mongoose from 'mongoose'

// Interfaces
import { Isubject } from '../../interfaces/subjects/subject'

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: String,
    studentsWhoTake: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ] 
})

export const Subject = mongoose.model<Isubject>('Subject', subjectSchema)