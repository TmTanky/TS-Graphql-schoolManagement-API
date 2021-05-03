import { Document } from "mongoose";
import { Iuser } from "../user/user";

export interface Iconcern extends Document {
    _id: string
    title: string
    concern: string
    isResolved: boolean
    ticketBy: Iuser
}