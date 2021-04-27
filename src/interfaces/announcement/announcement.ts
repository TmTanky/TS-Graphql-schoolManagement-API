import { Document } from "mongoose";

export interface Iannouncement extends Document {
    title: string
    details: string
}