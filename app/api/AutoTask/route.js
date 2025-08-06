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
        const agent = new JSONAgent({model:genAi})
        const date = new Date()
        const prompt = message+`. And information is : the media is ${file?file.name+" and media is available":" nothing."} the date is ${date.toUTCString()} and time is ${date.toTimeString()}`
        const agent_reply = await agent.getResponse(prompt)
        console.log(prompt)
        console.log(agent_reply)
        
        const user = await authenticateToken(req);
        const userExists = await User.findById(user?.user?.id)

        if(!user || !userExists || !user?.user?.id){
            return Response.json({"message":"Authentication Error"},{status:401})
        }

        //upload function for store files in cloudinary
        //returns type and name of file

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

        //Check saveData in current directory
        //These all return input back if successful else message with error

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
                        return {isAction:false,status:"other",actionName:"memory"}}
                        const uploadData = await uploadFile()
                    return await saveMemory(task,user?.user,uploadData)

                case "notification":
                    return await saveNotification(task,user?.user)

                default:
                    throw new Error(`Unknown actionName: ${task.actionName}`);
            }
        }

        //Agent can return a json object or json array
        const replyMessage = []
        if(Array.isArray(agent_reply)){
            for(let task of agent_reply){
                if(task.isAction && task){
                    replyMessage.push(await saveData(task))
                }
                else
                {
                    replyMessage.push(agent_reply)
                }
            }
        }
        else{
            if(agent_reply.isAction && agent_reply)
            {
                replyMessage.push(await saveData(agent_reply))
            }
            else
            {
                replyMessage.push(agent_reply)
            }
        }
        return Response.json({message:replyMessage||"Error is response"})
    }
    catch(err){
        console.log("Error Occured",err)
        return Response.json({message:{isAction:false,actionName:"Try again"}})
    }
}