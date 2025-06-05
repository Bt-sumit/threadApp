import { ApolloServer } from "@apollo/server";
import { users } from "./users";

const grapqqlServer = async () => {
    const typeDefs = `#graphql
        ${users.typeDefs}

        type Query {
           ${users.query}
        }
        type Mutation {
            ${users.Mutation}
        }
    `;
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers: {
            Query: {
                ...users.resolvers.queries,
            },
            Mutation: {
                ...users.resolvers.Mutation,
            }
        },

    });
    return apolloServer;
};

export default grapqqlServer;
