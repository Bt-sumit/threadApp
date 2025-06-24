export const typeDefs = `#graphql
type CreateUserResponse {
  success: Boolean!
  message: String!
  data: UserData
}
type CreateUserPost {
  success: Boolean!
  message: String!
  data: [post!]
}
type post{
    userId: ID!
    title: String!
    description: String!
}
`;
