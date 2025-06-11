export const typeDefs = `#graphql
type CreateUserResponse {
  success: Boolean!
  message: String!
  data: UserData
}
type post{
    userId: ID!
    title: String!
    description: String!
}
`;
