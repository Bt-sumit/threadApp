import postModel from "../schema/post"
export interface postInterface {
    title: string,
    description: string,
    userId:string
}
class userPost {
    public static createUserPost = async (payload: postInterface) => {
        await postModel.create(payload)
    }

}
export default userPost