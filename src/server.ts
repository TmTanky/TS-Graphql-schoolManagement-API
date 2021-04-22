require('dotenv').config()
import express from 'express'
import cors from 'cors'
// import helmet from 'helmet'

import {connect} from 'mongoose'
import { graphqlHTTP } from 'express-graphql'

// Schema
import { schema } from './graphql/schema/schema'

// Resolver
import { root } from './graphql/resolver/resolver'


const app = express()
const PORT = process.env.PORT || 8000

connect(`mongodb+srv://TmAdmin:${process.env.MONGO_PASSWORD}@cluster0.c7khy.mongodb.net/TS-grapqhl-first?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

app.use(cors())
// app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})