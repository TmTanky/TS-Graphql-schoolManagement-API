import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type Query {
        loginUser(email: String!, password: String!): userInfo
        allSubjects: [subject]
    }

    type userInfo  {
        _id: String!
        firstName: String!
        middleName: String!
        lastName: String!
        age: Int!
        email: String!
        role: String!
    }

    type subject {
        _id: String!
        name: String!
        description: String!
    }

    type Mutation {

        createUser(
            firstName: String!
            middleName: String!
            lastName: String!
            age: Int!
            email: String!
            password: String!
        ): userInfo

        createSubject(
            name: String!
            description: String!
        ): subject



    }
`)