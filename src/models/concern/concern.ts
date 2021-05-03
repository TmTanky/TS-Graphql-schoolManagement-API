import mongoose from 'mongoose'

// Interfaces
import { Iconcern } from '../../interfaces/concern/concern'

const concernSchema = new mongoose.Schema({
    title: String,
    concern: String,
    ticketBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isResolved: false
})

export const Concern = mongoose.model<Iconcern>('Concern', concernSchema)