export const Mutation = `#graphql
  createUser(name: String!, email: String!, password: String!): CreateUserResponse
  signIn(email: String!, password: String!): CreateUserResponse
  post(title: String!, description: String!): CreateUserResponse
  logout: CreateUserResponse
`
