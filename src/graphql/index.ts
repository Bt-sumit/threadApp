import { ApolloServer } from "@apollo/server";
import { users } from "./users";
import { userPost } from "./post/index";
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
            const rawMessage = formattedError.message;

            // Optional: match specific known validation issues
            if (rawMessage.includes('Upload') && rawMessage.includes('was not provided')) {
                return {
                    success: false,
                    message: "No file uploaded. Please provide a valid file.",
                    code: 'BAD_USER_INPUT',
    
                };
            }

            return {
                success: false,
                message: rawMessage,
                code,

            };
        }
        ,
        csrfPrevention: false,

    });
    return apolloServer;
};

export default grapqqlServer;
