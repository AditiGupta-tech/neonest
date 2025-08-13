import connectDB from "@/lib/connectDB";
import Feeding from "@/app/models/Feeding.model";
import Memory from "@/app/models/Memory.model";
import Essentials from "@/app/models/Essentials.model";
import Notification from "@/app/models/Notification.model";
import Sleep from "@/app/models/Sleep.model";
import Vaccine from "@/app/models/Vaccine.model";
import { formatTime } from "@/utils/formatTime";

await connectDB()

const saveFeeding=async (task,user)=>{
    const {time,type,amount,notes} = task.values;

    if(!time || !type || !amount){
        return {
            isAction:false,
            actionName:"Data Missing in Feeding",
            request:"failed",
        }
    }
    const feedConfig = {
        babyId:user.id,
        time,
        type,
        amount,
        notes,
    }
    try{
        const feeding = new Feeding(feedConfig)
        await feeding.save()
        console.log("Feeding Saved")
        await saveConfirmation(task,user,"Feeding");
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Feeding",
            request:"failed",
        }
    }
}
const saveMemory = async (task,user,uploadData)=>{
    const {title,description,type,tags,isPublic} = task.values;

    if(!title || !description){
        return {
            isAction:false,
            actionName:"Data Missing in Memory",
            request:"failed",
        }
    }
    const memoryConfig = {
        user:user.id,
        title,
        description,
        type:uploadData.type,
        file:uploadData.url,
        tags,
        isPublic
    }
    try{
        const memory = new Memory(memoryConfig)
        await memory.save()
        console.log("Memory Saved")
        await saveConfirmation(task,user,"Memories");
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Memory",
            request:"failed",
        }
    }

}
const saveEssentials = async (task,user)=>{
    const {name,category,currentStock,minThreshold,unit,notes} = task.values;

    if(!name || !currentStock || !minThreshold){
        return {
            isAction:false,
            actionName:"Data Missing in Essentials",
            request:"failed",
        }
    }
    const essentialsConfig = {
        userId:user.id,
        name,
        category,
        currentStock,
        minThreshold,
        unit,
        notes
    }
    try{
        const essentials = new Essentials(essentialsConfig)
        await essentials.save()
        console.log("Essentials Saved")
        await saveConfirmation(task,user,"Essentials");
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Essentials",
            request:"failed",
        }
    }

}
const saveDoctorContact = async (task,user)=>{
    const {name,category,type,value,description} = task.values;
    try
    {
    if(!name || !category || !type || !value){
        return {
            isAction:false,
            actionName:"Data Missing in Contact",
            request:"failed",
        }
    }
    await saveConfirmation(task,user,"Medical");
    return task
    }
    catch(err)
    {
        console.log(err)
        return {
            isAction:false,
            actionName:"Contact",
            request:"failed",
        }
    }
}

const saveNotification = async (task,user)=>{
    const {type,title,message,priority,scheduledFor,isRead,isSent,actionUrl,metadata,category} = task.values;

    if(!title || !type || !message ||!scheduledFor){
        return {
            isAction:false,
            actionName:"Data Missing in Notification",
            request:"failed",
        }
    }
    const notesConfig = {
        babyId:user.id,
        title,
        type,
        message,
        priority,
        scheduledFor,
        isRead,
        isSent,
        actionUrl,
        metadata,
        category

    }
    try{
        const notification = new Notification(notesConfig)
        await notification.save()
        console.log("Notifications Saved")
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Notification",
            request:"failed",
        }
    }

}
const saveSleep = async (task,user)=>{
    const {babyName,time,type,duration,mood,notes,date} = task.values;

    if(!babyName || !time || !type || !duration || !date){
        return {
            isAction:false,
            actionName:"Data Missing in Sleep",
            request:"failed",
        }
    }
    const sleepConfig = {
        userId:user.id,
        babyName,
        time,
        type,
        duration,
        mood,
        notes,
        date
    }
    try{
        const sleep = new Sleep(sleepConfig)
        await sleep.save()
        console.log("Sleep Saved")
        await saveConfirmation(task,user,"Sleep");
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Sleep",
            request:"failed",
        }
    }

}
const saveVaccination = async (task,user)=>{
    const {name,description,scheduledDate,completeDate,status,notes,document,ageMonths,isStandard} = task.values;

    if(!name || !scheduledDate ){
        return {
            isAction:false,
            actionName:"Data Missing in Vaccination",
            request:"failed",
        }
    }
    const vaccinConfig = {
        userId:user.id,
        name,
        description,
        scheduledDate,
        completeDate,
        status,notes,
        document,
        ageMonths,
        isStandard
    }
    try{
        const vaccination = new Vaccine(vaccinConfig)
        await vaccination.save()
        console.log("Vaccin Detail Saved")
        await saveConfirmation(task,user,"Medical");
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            actionName:"Vaccination",
            request:"failed",
        }
    }

}
const saveGrowth = async (task,user)=>{
    try
    {
        const {date,height,weight,head,comment} = task.values;

        if(!date || !(height || weight || head)){
            return {
            isAction:false,
            actionName:"Data Missing in Growth",
            request:"failed",
        }
        }
        await saveConfirmation(task,user,"Growth");
        return task
    }
    catch(err)
    {
        console.log(err)
        return {
            isAction:false,
            actionName:"Growth",
            request:"failed",
        }
    }
}

const saveConfirmation = async (task,user,actionUrl) =>{
    try{
        const {time,date,actionName} = task
        if(!time||!date||!actionName){
            console.log("Confirmation Not Sent")
            return
        }
        const confirmationConfig ={
            babyId:user.id,
            type:"general",
            title:`${actionName} Updated Successfully!`,
            message:`${actionName} updated on ${time}`,
            priority:"low",
            scheduledFor:date,
            actionUrl,
        }
        const notification = new Notification(confirmationConfig)
        await notification.save()
        console.log("Confirmation Saved Successfully")
    }
    catch(err)
    {
        console.log("Confirmation Not Send : ",err)
    }
}

export {
    saveDoctorContact,
    saveEssentials,
    saveFeeding,
    saveGrowth,
    saveMemory,
    saveSleep,
    saveVaccination,
    saveNotification
}