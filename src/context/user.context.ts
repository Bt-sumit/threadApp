import jwt from "jsonwebtoken";
import { Request } from "express";
import userModel from "../schema/user";
const secretkey: string = "RobertRDalgadoverses"
export interface MyContext {
  currentUser: any | null;
}
export const userContext = async ({ req }: { req: Request }): Promise<MyContext> => {
  const token = req.headers.authorization?.replace("Bearer", "");
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, secretkey) as { _id: string };;
      const userData=await userModel.findOne({_id:decoded?._id})
      currentUser = userData;      
    } catch (err) {
      console.log("Invalid or expired token");
    }
  }

  return { currentUser };
};
