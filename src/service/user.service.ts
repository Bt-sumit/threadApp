import passwordEncryption from "../helper/bcrypt";
import createJsonWebTokken from "../helper/jwttoken";
import userModel from "../schema/user";
export interface userSignup {
    toObject: any;
    name: string;
    email: string;
    password: string;
}
export interface signIn{
    email:string;
    password:string;
}
class userService {
    public static signup = async (payload: userSignup) => {

        let { name, email, password } = payload;
        password=await passwordEncryption(password)
        const userData = await userModel.create({ name, email, password });
        return {id:userData._id, name: userData.name, email: userData.email};
    }
    public static signIn=async(payload:userSignup)=>{
        const data=await createJsonWebTokken(payload)
        console.log("-----------------",data)
        return data
    }
    
    
}
export default userService