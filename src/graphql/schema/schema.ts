import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Query {
        loginUser(email: String!, password: String!): userInfo
        allUsers: [userInfo]
        allSubjects: [subject]
        allAnnouncements: [announcement]
        allConcerns: [concern]
        oneUser(userID: ID!): userInfo
        oneSubject(subjectID: ID!): subject
        oneTicket(ticketID: ID!): concern
    }

    type announcement {
        _id: ID!
        title: String!
        details: String!
    }

    type userInfo  {
        _id: ID!
        firstName: String!
        middleName: String!
        lastName: String!
        email: String!
        role: String!
        subjects: [subject]
        instructorsSubjects: [subject]
        myTickets: [concern]
    }

    type subject {
        _id: ID!
        name: String!
        description: String!
        instructor: userInfo
        studentsWhoTake: [userInfo]
    }

    type concern {
        _id: ID!
        title: String!
        concern: String!
        isResolved: Boolean!
        ticketBy: userInfo
    }

    type Mutation {

        createUser(
            firstName: String!
            middleName: String!
            lastName: String!
            email: String!
            password: String!
            passwordConfirm: String!    
        ): userInfo

        userChangeRole(
            personID: ID!
            newRole: String!
        ): userInfo

        editUsersName(
            userID: ID!
            firstName: String!
            middleName: String!
            lastName: String!
        ): userInfo

        createSubject(
            name: String!
            description: String!
            instructor: ID
        ): subject

        editSubject(
            subjectID: ID!
            newName: String!
            newDescription: String!
        ): subject

        assignInstructor(
            subjectID: ID!
            instructorID: ID!
        ): subject

        deleteSubject(subjectID: ID!) : subject

        studentTakeSubject(
            toTakeSubjects: [String!]
            student: ID!
        ): userInfo

        studentRemoveSubject(
            toRemoveSubjects: [String!]
            student: ID!
        ): userInfo

        createAnnouncement(
            title: String!
            details: String!
        ): announcement

        createConcern(
            userID: ID!
            title: String!
            concern: String!
        ): concern

        concernDone(
            ticketID: ID!
        ): concern

        concernUndo(
            ticketID: ID!
        ): concern

    }
`)