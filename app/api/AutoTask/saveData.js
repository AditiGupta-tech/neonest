import connectDB from "@/lib/connectDB";
import Feeding from "@/app/models/Feeding.model";
import Memory from "@/app/models/Memory.model";
import Essentials from "@/app/models/Essentials.model";
import Notification from "@/app/models/Notification.model";
import Sleep from "@/app/models/Sleep.model";
import Vaccine from "@/app/models/Vaccine.model";

await connectDB()

const saveFeeding=async (task,user)=>{
    const {time,type,amount,notes} = task.values;

    if(!time || !type || !amount){
        throw Error("Some fields are empty in Feeding")
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
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Feeding"}
    }
}
const saveMemory = async (task,user,uploadData)=>{
    const {title,description,type,tags,isPublic} = task.values;

    if(!title || !description){
        throw Error("Some fields are empty in Memory")
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
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Memory"}
    }

}
const saveEssentials = async (task,user)=>{
    const {name,category,currentStock,minThreshold,unit,notes} = task.values;

    if(!name || !currentStock || !minThreshold){
        throw Error("Some fields are empty in Essentials")
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
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Essentials"}
    }

}
const saveDoctorContact = async (task,user)=>{
    const {name,category,type,value,description} = task.values;
    try{
        if(!name || !category || !type || !value){
            throw Error("Some fields are empty in Doctors Contact")
        }
        return task
    }catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Contact"}
    }
}

const saveNotification = async (task,user)=>{
    const {type,title,message,priority,scheduledFor,isRead,isSent,actionUrl,metadata,category} = task.values;

    if(!title || !type || !message ||!scheduledFor){
        throw Error("Some fields are empty in Notifications")
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
            request:"other",
            actionName:"Notifications"}
    }

}
const saveSleep = async (task,user)=>{
    const {babyName,time,type,duration,mood,notes,date} = task.values;

    if(!time || !type || !duration || !date){
        throw Error("Some fields are empty in Sleep")
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
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Sleep"}
    }

}
const saveVaccination = async (task,user)=>{
    const {name,description,scheduledDate,completeDate,status,notes,document,ageMonths,isStandard} = task.values;

    if(!name || !scheduledDate ){
        throw Error("Some fields are empty in Vaccination")
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
        return task
    }
    catch(err){
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Vaccine"
        }
    }

}
const saveGrowth = async (task,user)=>{
    const {date,height,weight,head,comment} = task.values;
    try{
        if(!date || !(height || weight || head))
        {
            throw Error("Some fields are empty in Growth")
        }
        return task
    }
    catch(err)
    {
        console.log(err)
        return {
            isAction:false,
            request:"other",
            actionName:"Growth"}
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