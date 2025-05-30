import bcrypt from "bcrypt"
const saltnumber:number = 10
const  passwordEncryption=async(password:string)=>{
const hashPassword=await bcrypt.hash(password, saltnumber);
return hashPassword

}

export default passwordEncryption