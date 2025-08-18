import JSONAgent from "@/lib/agent"
import { GoogleGenerativeAI } from "@google/generative-ai"
import User from "@/app/models/User.model";
import { authenticateToken } from "@/lib/auth";
import { saveMemory,
    saveDoctorContact,
    saveEssentials,
    saveFeeding,
    saveGrowth,
    saveNotification,
    saveSleep,
    saveVaccination,

} from "./saveData";
import { cloudinary } from "@/lib/cloudinary";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API)
export async function POST(req){

    try{
    const formData = await req.formData()
    const message = formData.get("message")
    const file = formData.get("file")
    const time = formData.get("time")

    const errorMessage = {isAction:false,request:"failed"}

    if(!message || message.length<9)
        return Response.json({...errorMessage,actionName:"Too Few Information"})

    const agent = new JSONAgent({model:genAi})
    const date = new Date()
    const prompt = message+`. The date is ${date.toUTCString()} and time is ${time?time:date.toTimeString()}.`
    const agent_reply = await agent.getResponse(prompt)
    console.log('agent reply :',agent_reply)
    console.log(prompt)
    const user = await authenticateToken(req);
    const userExists = await User.findById(user?.user?.id)

    if(!user || !userExists || !user?.user?.id){
        return Response.json({...errorMessage,actionName:"Authentication Failed"},{status:401})
    }

    const uploadFile = async()=>{
        const buffer = await file.arrayBuffer();
        const bytes = Buffer.from(buffer);

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
            );
            stream.end(bytes);
        });
        return {type:result.resource_type,url:result.secure_url}
    }

    const saveData= async (task)=>{
        switch(task.actionName.toLowerCase()){
            case "growth":
                return await saveGrowth(task,user?.user)
            case "feeding":
                return await saveFeeding(task,user?.user)
            case "sleep":
                return await saveSleep(task,user?.user)
            case "vaccination":
                return await saveVaccination(task,user?.user)
            case "doctor_contact":
                return await saveDoctorContact(task,user?.user)
            case "essentials":
                return await saveEssentials(task,user?.user)
            case "memory":
                if(!file){
                    return {
                        isAction:false,
                        actionName:"Media Required",
                        request:"insert",
                        status:"failed"
                    };}
                const uploadData = await uploadFile()
                return await saveMemory(task,user?.user,uploadData)
            case "notification":
                return await saveNotification(task,user?.user)
            default:
                return {...errorMessage,actionName:"Invalid request"}
        }
    }
    const replyMessage = []
    if(Array.isArray(agent_reply)){
        for(let task of agent_reply){
            if(task){
                replyMessage.push(await saveData(task))
            }
            else{
                replyMessage.push({isAction:false, actionName:task?.actionName||"invalid request",request:task?.request||"null"})
            }
        }
        }
        else{
            if(agent_reply)
                replyMessage.push(await saveData(agent_reply))
            else
                replyMessage.push({...errorMessage,actionName:"Invalid request"})
        }
    console.log(replyMessage)
    return Response.json(replyMessage.length>0?replyMessage:{...errorMessage,actionName:"Invalid request"})
}catch(err){
    console.log("Error Occured",err)
    return Response.json({...errorMessage,actionName:"Invalid request"})
}
}