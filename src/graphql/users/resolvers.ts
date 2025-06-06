import comparePassword from "../../helper/comparepassword";
import userModel from "../../schema/user";
import userPost from "../../service/post.service";
import userService, { signIn } from "../../service/user.service";
import { userSignup } from "../../service/user.service";
import { postInterface } from "../../service/post.service";
const queries = {
  getCurrentLoggedInUser: async (_: any, __: any, context: any) => {
    try {
      console.log(context.currentUser);
      if (!context.currentUser) {
        return {
          success: false,
          message: "Bearer tokke is neeed to please give",
          data: null,
        };
      }
      return { success: true, message: "user Info", data: context.currentUser };
    } catch (error) {
      return { success: false, message: error, data: null };
    }
  },
  getUserList: async (_: any, __: any, context: any) => {
    try {
      if (!context.currentUser) {
        return {
          success: false,
          message: "Bearer tokke is neeed to please give",
          data: [],
        };
      }
      const users = await userService.userList();
      return { success: true, message: "User List", data: users };
    } catch (error) {
      return { success: false, message: error, data: [] };
    }
  },
};
const Mutation = {
  createUser: async (_: any, payload: userSignup) => {
    const userEmailExit = await userModel.findOne({ email: payload.email });
    if (userEmailExit) {
      return {
        success: false,
        message: "User with this email already exists",
        data: null,
      };
    }
    const Id = userService.signup(payload);
    return { success: true, message: "User successfully created", data: Id };
  },
  signIn: async (_: any, payload: signIn, { res }: { res: any }) => {
    try {
      const userEmailExit = await userModel.findOne({ email: payload.email });
      if (!userEmailExit) {
        return {
          success: false,
          message: "User with this email does not exist",
          data: null,
        };
      }
      const isPasswordValid = await comparePassword(payload?.password, userEmailExit?.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Please enter correct password",
          data: null,
        };
      }
      const token = await userService.signIn(userEmailExit);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      const { password, ...safeUser } = userEmailExit.toObject();
      return {
        success: true,
        message: "User login successful",
        data: safeUser,
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: false,
        message: error.message || "Something went wrong",
        data: null,
      };
    }
  },

  post: async (_: any, payload: postInterface, context: any) => {
    try {
      if (!context.currentUser) {
        return {
          success: false,
          message: "Bearer tokke is neeed to please give",
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
