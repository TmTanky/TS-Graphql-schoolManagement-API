import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Query {
        loginUser(email: String!, password: String!): userInfo
        allUsers: [userInfo]
        allSubjects: [subject]
        allAnnouncements: [announcement]
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
    }

    type subject {
        _id: ID!
        name: String!
        description: String!
        studentsWhoTake: [userInfo]
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

        createSubject(
            name: String!
            description: String!
        ): subject

        editSubject(
            subjectID: ID!
            newName: String!
            newDescription: String!
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


    }
`)