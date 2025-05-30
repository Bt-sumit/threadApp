
import bcrypt from "bcrypt"
const comparePassword = async (password: string, hashPassword: string) => {
    const result = await bcrypt.compare(password, hashPassword)
    return result
}
export default comparePassword