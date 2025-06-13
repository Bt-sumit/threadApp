import express from "express";
import connection from "./db/db";
import cookieParser from "cookie-parser";
import grapqqlServer from "./graphql";
import { expressMiddleware } from "@as-integrations/express5";
import { userContext } from "./context/user.context";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload-ts";
const server = async () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    const PORT = 4000;
    const apolloServer = await grapqqlServer();
    await connection()
    await apolloServer.start();
    app.use("/thread", expressMiddleware(apolloServer, { context: userContext }));
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};
server();
