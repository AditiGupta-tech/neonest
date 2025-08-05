import Feeding from "@/app/models/Feeding.model";
import User from "@/app/models/User.model";
import { authenticateToken } from "@/lib/auth";
import connectDB from "@/lib/connectDB";


export async function saveFeeding(req,data){
    await connectDB()
    try{
        const {time,type,amount,notes} = data?.values
        console.log(data)
        const baby = await authenticateToken(req)
        const userExists = await User.findById(baby?.user?.id);
        console.log("authorization",baby,userExists)
        
        if(!baby?.user?.id||!userExists){
            console.log("user not found")
            return}
        
        const feeding = {
            babyId:baby?.user?.id,
            time,
            type,
            amount,
            notes,
        }

        const newFeed = new Feeding(feeding)
        await newFeed.save()
        console.log("Feeding updated")
    
    }catch(error){
        console.log(error)
}
}