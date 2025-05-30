export const typeDefs = `#graphql
type UserData {
  _id: ID!
  name: String!
  email: String!
  token:String
}

type CreateUserResponse {
  success: Boolean!
  message: String!
  data: UserData
}
type signin{
  email:String!
  password:String!
}
`
