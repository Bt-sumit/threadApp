import { Request, Response } from "express";
import userModel from "../schema/user";
import jwt from "jsonwebtoken";
const secretKey = "RobertRDalgadoverses";
export const userContext = async ({ req, res }: { req: Request; res: Response }) => {
  const token = req.cookies?.token;
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey) as { _id: string };
      currentUser = await userModel.findOne({ _id: decoded._id });
    } catch (err) {
      console.log("Invalid or expired token");
    }
  }
  return { currentUser, req, res };
};
