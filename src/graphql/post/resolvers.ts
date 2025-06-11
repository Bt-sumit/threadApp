import userPost from "../../service/post.service";
import { postInterface } from "../../service/post.service";
import posValidation from "../../validation/post.validation";
const queries = {
   
};
const Mutation = {
    post: async (_: any, payload: postInterface, context: any) => {
        try {
            if (!context.currentUser) {
                return {
                    success: false,
                    message: "Bearer tokke is neeed to please give",
                    data: null,
                };
            }
            const validationResult = await posValidation.validatePost(payload);
            if (!validationResult.success && validationResult.error) {
                const firstErrorField = Object.keys(validationResult.error)[0];
                let firstErrorMessage = "Validation error";
                if (
                    typeof validationResult.error === "object" &&
                    !("message" in validationResult.error) &&
                    firstErrorField &&
                    Array.isArray((validationResult.error as Record<string, string[]>)[firstErrorField])
                ) {
                    firstErrorMessage = (validationResult.error as Record<string, string[]>)[firstErrorField][0] || "Validation error";
                }
                return {
                    success: false,
                    message: `${firstErrorMessage}`,
                    data: null,
                };
            }

            payload.userId = context?.currentUser?._id as string;
            await userPost.createUserPost(payload);
            return { success: true, message: "post added successfully", data: null };
        } catch (error) {
            return { success: false, message: error, data: null };
        }
    },
};
export const resolvers = { queries, Mutation };
