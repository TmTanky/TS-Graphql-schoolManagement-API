import { hash, compare } from 'bcrypt'

// Models
import { User } from '../../models/user/user'
import { Subject } from '../../models/subjects/subjects'
import { Iuser, UserRole } from "../../interfaces/user/user"
import { NextFunction } from "express"
import { Isubject } from '../../interfaces/subjects/subject'

export const root = {

    // Queries

    loginUser: async (args: Iuser) => {

        const {email, password} = args

        try {

            const loggingInUser = await User.findOne({email})

            if (!loggingInUser) {
                throw new Error ("User doesn't exist.")
            }

            const result = await compare(password, loggingInUser!.password)

            if (result) {
                return loggingInUser
            } else {
                throw new Error ('Invalid Password')
            }
            
        } catch (err) {
            return err
        }

    },

    // Mutations
    createUser: async (args: Iuser) => {

        const {firstName, middleName, lastName, age, email, password } =  args

        try {

            const ifExist = await User.findOne({email: args.email})

            if (firstName === "" || middleName === "" || lastName === "" || age === null || email === "") {
                throw new Error ('Please input all fields for user.')
            }

            if (ifExist) {
                throw new Error ('Email already taken.')
            }

            const hashedPassword = await hash(password, 10)

            const newUser = new User({
                firstName,
                middleName,
                lastName,
                age,
                email,
                password: hashedPassword,
                role: UserRole.STUDENT
            })

            await newUser.save()

            return newUser
            
        } catch (err) {
            return err
        }

    },

    createSubject: async (args: Isubject) => {

        const { name, description } = args

        try {

            if (name === "" || description === "") {
                throw new Error ('Please input all fields for subject.')
            }

            const newSubject = new Subject({
                name,
                description
            })
    
            await newSubject.save()
    
            return newSubject
            
        } catch (err) {
            
            if (err.code === 11000) {
                throw new Error ('Subject name already exist.')
            }

            return err
        }

    }

}