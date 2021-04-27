import mongoose from 'mongoose'
import { Iannouncement } from '../../interfaces/announcement/announcement'

const announcementSchema = new mongoose.Schema({
    title: String,
    details: String
}, { timestamps: true })

export const Announcement = mongoose.model<Iannouncement>('Announcement', announcementSchema)