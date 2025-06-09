import { z, ZodError } from "zod";
import { signIn } from "../service/user.service";
class UserValidation {
  private static signupSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  public static async validateSignup(data: signIn) {
    try {
      const parsed = await this.signupSchema.parseAsync(data);
      return {
        success: true,
        data: parsed,
        error: null,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          data: null,
          error: error.flatten().fieldErrors,
        };
      }
      return {
        success: false,
        data: null,
        error: { message: "Unknown error during validation" },
      };
    }
  }
}

export default UserValidation;
