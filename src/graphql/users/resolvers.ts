import comparePassword from "../../helper/comparepassword"
import userModel from "../../schema/user"
import userService, { signIn } from "../../service/user.service"
import { userSignup } from "../../service/user.service"
const queries = {
    getCurrentLoggedInUser: async (_: any, __: any, context: any) => {
        try {
            console.log(context.currentUser)
            if (!context.currentUser) {
                return { success: false, message: "Bearer tokke is neeed to please give", data: null }
            }
            return { success: true, message: "user Info", data: context.currentUser }
        } catch (error) {
            return { success: false, message: error, data: null }
        }
    },
    getUserList: async (_: any, __: any, context: any) => {
        try {
            if (!context.currentUser) {
                return { success: false, message: "Bearer tokke is neeed to please give", data: [] }
            }
            const users = await userService.userList()
            return { success: true, message: "User List", data: users }

        } catch (error) {
            return { success: false, message: error, data: [] }
        }
    }
}
const Mutation = {
    createUser: async (_: any, payload: userSignup) => {
        const userEmailExit = await userModel.findOne({ email: payload.email })
        if (userEmailExit) {
            return { success: false, message: "User with this email already exists", data: null, }
        }
        const Id = userService.signup(payload)
        return { success: true, message: "User successfully created", data: Id, }
    },
    signIn: async (_: any, payload: signIn) => {
        try {
            const userEmailExit = await userModel.findOne({ email: payload.email })
            if (!userEmailExit) {
                return { success: false, message: "User with this email not exits", data: null, }
            }
            if (!await comparePassword(payload?.password, userEmailExit?.password)) {
                return { success: false, message: "Please enter correct password", data: null, }
            }
            const data = await userService.signIn(userEmailExit)
            const userInfo = userEmailExit.toObject()
            const userWithToken = { ...userInfo, token: data }
            return { success: true, message: "user login successfully", data: userWithToken, }
        } catch (error) {
            return { success: false, message: error, data: null, }
        }
    }

}
export const resolvers = { queries, Mutation }