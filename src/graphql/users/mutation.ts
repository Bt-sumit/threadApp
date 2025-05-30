export const Mutation = `#graphql
  createUser(name: String!, email: String!, password: String!): CreateUserResponse
  signIn(email: String!, password: String!): CreateUserResponse
`
