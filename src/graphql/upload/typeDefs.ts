export const typeDefs = `#graphql
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type response{
    success: Boolean!
    message: String!
    data:String
  }

  type Query {
    otherFields: Boolean!
  }


`;
