import { z, ZodError } from "zod";
import { postInterface } from "../service/post.service";
class posValidation {
    private static postSchema = z.object({
        title: z.string().min(1,"title is required"),
        description: z.string().min(1, "Description is required"),
    });
    public static validatePost = async (data: postInterface) => {
        try {
            const parsed = await this.postSchema.parseAsync(data);
            return {  success: true, data: parsed, error: null,};
        } catch (error) {
            if (error instanceof ZodError) {
                return {  success: false, data: null, error: error.flatten().fieldErrors,};
            }
            return { success: false, data: null, error: { message: "Unknown error during validation" },};
        }
    }
}

export default posValidation;
