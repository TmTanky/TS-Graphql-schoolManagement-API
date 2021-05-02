import { hash, compare } from 'bcrypt'

// Models
import { User } from '../../models/user/user'
import { Subject } from '../../models/subjects/subjects'
import { Announcement } from '../../models/announcement/announcement'

// Interfaces
import { Iuser, UserRole } from "../../interfaces/user/user"
import { Isubject } from '../../interfaces/subjects/subject'
import { Iannouncement } from '../../interfaces/announcement/announcement'

export const root = {

    // Queries

    loginUser: async (args: Iuser) => {

        const {email, password} = args

        try {

            if (email === "" || password === "") {
                throw new Error ('Please input all fields.')
            }

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

    allUsers: async () => {

        try {

            const allUsers = await User.find({}).populate('subjects')

            return allUsers
            
        } catch (err) {
            return err
        }

    },

    allSubjects: async () => {

        try {

            const allSubjects = await Subject.find({}).populate('studentsWhoTake').populate('instructor')

            return allSubjects
            
        } catch (err) {
            return err
        }

    },

    allAnnouncements: async () => {

        try {

            const allAnnouncements = await Announcement.find({})

            return allAnnouncements
            
        } catch (err) {
            return err
        }

    },

    oneUser: async (args: {userID: string}) => {

        const { userID } = args

        const foundUser = await User.findOne({_id: userID}).populate('instructorsSubjects').populate('subjects').populate({
            path: 'instructorsSubjects',
            populate: 'studentsWhoTake'
        })
        
        if (!foundUser) {
            throw new Error ('No user found.')
        }

        return foundUser

    },

    oneSubject: async (args: {subjectID: string}) => {

        const { subjectID } = args

        try {

            const foundSubject = await Subject.findOne({_id: subjectID}).populate('studentsWhoTake').populate('instructor')

            return foundSubject
            
        } catch (err) {
            return err
        }

    },

    // Mutations
    createUser: async (args: Iuser) => {

        const {firstName, middleName, lastName, email, password, passwordConfirm } =  args

        try {

            const ifExist = await User.findOne({email: args.email})

            if (firstName === "" || middleName === "" || lastName === "" || email === "") {
                throw new Error ('Please input all fields for user.')
            }

            if (password.length < 5) {
                throw new Error ('Password must be 5 characters long.')
            }

            if (password !== passwordConfirm) {
                throw new Error ('Password must match.')
            }

            if (ifExist) {
                throw new Error ('Email already taken.')
            }

            const hashedPassword = await hash(password, 10)

            const newUser = new User({
                firstName: firstName.toUpperCase(),
                middleName: middleName.toUpperCase(),
                lastName: lastName.toUpperCase(),
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

    userChangeRole: async (args: {personID: string, newRole: UserRole}) => {

        const { personID, newRole } = args

        if (!Object.values(UserRole).includes(newRole)) {
            throw new Error ('Invalid Role.')
        }
        
        try {

            const changeRole = await User.findOneAndUpdate({_id: personID}, {
                role: newRole
            }, {new: true})

            return changeRole
            
        } catch (err) {
            return err
        }

    },

    editUsersName: async (args: {userID: string, firstName: string, middleName: string, lastName: string}) => {

        const {userID, firstName, lastName, middleName} = args

        try {

            if (firstName === "" || middleName === "" || lastName === "") {
                throw new Error ('Please fill all inputs.')
            }

            const foundUser = await User.findOneAndUpdate({_id: userID}, {
                firstName: firstName.toUpperCase(),
                middleName: middleName.toUpperCase(),
                lastName: lastName.toUpperCase()
            }, {new: true})

            return foundUser
            
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

    },

    editSubject: async (args: {subjectID: Isubject , newName: string, newDescription: string}) => {

        const { newName, newDescription, subjectID } = args

        try {

            if (newName === "" || newDescription === "") {
                throw new Error ('Please input all fields.')
            }

            const toBeEditedSubject3 = await Subject.findOneAndUpdate({_id: subjectID}, {
                name: newName,
                description: newDescription
            }, { new: true })

            return toBeEditedSubject3

            
        } catch (err) {
            return err
        }

    },

    deleteSubject: async (args: { subjectID: string }) => {

        const { subjectID } = args

        try {

            const toBeDeleted = await Subject.findByIdAndDelete(subjectID)

            return toBeDeleted

            
        } catch (err) {
            return err
        }

    },

    assignInstructor: async (args: {instructorID: Iuser, subjectID: Isubject}) => {

        const { instructorID, subjectID } = args

        try {

            const currentInstructor = await Subject.findOne({_id: subjectID}).populate('instructor')
            const oldInstructor = currentInstructor?.instructor._id

            console.log(instructorID)
            console.log(oldInstructor)

            if (oldInstructor == instructorID) {
                return currentInstructor
            } else {

                await User.findOneAndUpdate({_id: oldInstructor}, {
                    $pull: {
                        instructorsSubjects: subjectID
                    }
                })

                await User.findOneAndUpdate({_id: instructorID}, {
                    $addToSet: {
                        instructorsSubjects: subjectID
                    }
                }) 

                const newInstructor = await Subject.findOneAndUpdate({_id: subjectID}, {
                    instructor: instructorID
                }, {new: true}).populate('instructor')

                return newInstructor

            }
            
        } catch (err) {
            return err
        }

    },

    studentTakeSubject: async (args: { toTakeSubjects: Isubject[], student: Iuser }) => {

        const { toTakeSubjects, student } = args

        try {

            toTakeSubjects.map(async item => {
                await Subject.findOneAndUpdate({_id: item}, {
                    $addToSet: {
                        studentsWhoTake: student
                    }
                })
            })

            const studentWhoTake = await User.findOneAndUpdate({_id: student}, {
                $addToSet: {
                    subjects: { $each: [...toTakeSubjects] }
                }
            }, {new: true}).populate('subjects')

            return studentWhoTake
            
        } catch (err) {
            return err
        }

    },
    
    studentRemoveSubject: async (args: { toRemoveSubjects: Isubject[], student: string} ) => {

        const { toRemoveSubjects, student } = args

        try {

            toRemoveSubjects.map(async item => {
                await Subject.findOneAndUpdate({_id: item}, {
                    $pull: {
                        studentsWhoTake: student
                    }
                })
            })

            toRemoveSubjects.map( async item => {
                const studentWhoTake = await User.findOneAndUpdate({_id: student}, {
                    $pull: {
                        subjects: item
                    }
                }, {new: false}).populate('subjects')

                return studentWhoTake
            })

            
        } catch (err) {
            return err
        }

    },

    createAnnouncement: async (args: Iannouncement ) => {

        const {title, details} = args

        try {

            const createAnnouncement = new Announcement({
                title,
                details
            })

            createAnnouncement.save()

            return createAnnouncement
            
        } catch (err) {
            return err
        }

    }

}