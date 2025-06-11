import { ApolloServer } from "@apollo/server";
import { users } from "./users";
import {userPost} from "./post/index";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { uploadImage } from "./upload/index";

const grapqqlServer = async () => {
    const typeDefs = `#graphql
        ${users.typeDefs}
        ${userPost.typeDefs}
          ${uploadImage.typeDefs}
        type Query {
           ${users.query}
        }
        type Mutation {
            ${users.Mutation}
            ${userPost.Mutation}
            ${uploadImage.Mutation}
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
                ...userPost.resolvers.Mutation,
                ...uploadImage.resolvers.Mutation
            }
        },
        plugins: [
            ApolloServerPluginLandingPageLocalDefault(),
            {
                async requestDidStart() {
                    return {
                        async didEncounterErrors(ctx) {
                            for (const err of ctx.errors) {
                                if (err?.extensions?.code !== 'GRAPHQL_VALIDATION_FAILED') {
                                    console.error('Unexpected Error:', err.message);
                                    if (err.stack) {
                                        console.error(err.stack);
                                    }
                                } else {
                                    console.warn('Validation Error:', err.message);
                                }
                            }
                        },
                    };
                },
            },
        ], formatError: (formattedError) => {
            const code = formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR';

            if (code === 'GRAPHQL_VALIDATION_FAILED') {
                return {
                    message: `Validation Error: ${formattedError.message}`,
                    code,
                    status:false
                };
            }
            return {
                message: formattedError.message,
                code,
                status:false
            };
        },
        csrfPrevention: false,

    });
    return apolloServer;
};

export default grapqqlServer;
