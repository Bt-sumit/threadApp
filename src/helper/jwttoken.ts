import  Jwt  from "jsonwebtoken";
import {  userSignup } from "../service/user.service";
const secretkey:string = "RobertRDalgadoverses"
const createJsonWebTokken=async(payload:userSignup)=>{
    const tokenData= Jwt.sign(payload.toObject(), secretkey, { expiresIn: "24h" })
    return tokenData

}
export default createJsonWebTokken