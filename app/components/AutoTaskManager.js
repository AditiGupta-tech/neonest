import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import { useAutoTask } from "../context/AutoChatContext";
import { X,ShareIcon,File, XCircle,LoaderCircle,Trash} from "lucide-react";
import { useEffect, useRef, useState } from "react";
const AutoTaskManager=()=>{
    const {isAutoTask,setAutoTask,getResponse,isLoading,updates,setNewUpdates} = useAutoTask()
    const [position,setPosition] = useState({x:0,y:0})
    const [message, setMessage] = useState("")
    const [file,setFile] = useState(null)
    const [uploaded,setUploaded] = useState(false)
    const fileRef = useRef(null)
    
    useEffect(()=>
    {
        const trackMove =(e)=>
        {setPosition
            ({
                x:(e.clientX/window.innerWidth*4.5),
                y:(e.clientY/window.innerHeight)*5.5
            })
        }

        window.addEventListener('mousemove',trackMove)

        return ()=>
            {
                window.removeEventListener('mousemove',trackMove)
                setAutoTask(false)
            }
    },[])


    const handleInput = (event)=>
    {
        setMessage(event.target.value)
    }


    const handleFileInput = ()=>
    {
        fileRef.current.click()
    }


    const handleFileChange=(event)=>
    {
        const file = event.target.files[0]
        if(file)
        {
            setFile(file)
            setUploaded(true)
        }
    }


    const sendRequest=async ()=>
    {
        const data = 
        {
            message,
            file
        }
        setMessage("")
        setFile(null)
        setUploaded(false)
        const response = await getResponse(data)
        console.log(response)
    }


    const colorType = (type)=>{
        if(type=="insert") return {color:"white",background:"#4b0"}
        else if(type=="update") return {color:"#ff0",background:"#9a0"}
        else if(type=="delete") return {color:"#d22",background:"#b77"}
        else return {color:"#5be",background:"#669"}
    }

    const getContent = (type)=>
    {
        switch(type)
        {
            case "essentials": return "📦"
            case "feeding" : return "🍼"
            case "growth" : return "🐱‍🏍"
            case "doctor_contact" : return "☎"
            case "sleep": return "😴"
            case "medical" : return "🩺"
            case "memory" : return "🎥"
            case "vaccination":return "💉"
            default : return "❌"
        }
    }

    const handleUpdates=()=>{
        const UI = updates.map((msg,i)=>
        {
            if(msg.isAction){
                if(msg.actionName==="notification") return;
                return <div style={colorType(msg?.request)} className="text-sm p-2 py-0 rounded-full m-2" key={i}>
                            {getContent(msg.actionName)}
                            {msg.actionName}
                        </div>
            }
            else
            {
                return <div style={colorType(msg?.request)} className=" p-2 py-0 rounded-full overflow-auto m-2" key={i}>
                            ❌ {msg.actionName}
                        </div>
            }
        })
        return UI
    }

    return(<>
        <AnimatePresence>
            {   isAutoTask &&
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95, scaleY:0.1,background:"#caaf" }}
                    animate={{ opacity: 1, y: 0, scale: 1, scaleY:1,background:"#caaa" }}
                    exit={{ opacity: 0, y: -10, scale: 0.95, scaleY:0.1,background:"#caaf" }}
                            transition={{ duration: 0.2 }}
                    className="fixed flex flex-col w-full h-full top-[80px] z-50 items-center justify-center ">
                    <div className="flex-col flex w-full top-[80px] z-50 items-center h-full">

                    
                    <div className="my-10 sm:my-4 flex-col sm:flex-row flex items-center w-full sm:w-[80%] z-50 bg-white rounded-xl shadow-lg border border-l-4 border-gray-200 m-4" >
                        {/*Close Button*/}
                        <X className="absolute top-0 right-0 text-pink-500 m-4 hover:text-purple-700 cursor-pointer" onClick={()=>setAutoTask(false)}></X>

                        <Input value={message}  onInput={(e)=>{handleInput(e)}} className="flex-grow !w-[95%]  sm:w-full m-4 p-2" placeholder="Manage Your Logs Here... e.g. Add Essential &#128504;"></Input>
                        <div className="m-2 w-full sm:w-auto flex items-center justify-end sm:justify-center">
                            {isLoading && <LoaderCircle className="animate-spin m-4"></LoaderCircle>}
                        {   
                            !uploaded ?
                            
                            <div className="cursor-pointer">
                                <ShareIcon onClick={handleFileInput} aria-disabled={isLoading} className="h-10 text-gray-500 hover:text-pink-500 font-light"></ShareIcon>
                                <input type="file" ref={fileRef} className="hidden" onChange={(e)=>handleFileChange(e)}></input>
                            </div>
                            :
                            <div className="relative cursor-pointer bg-slate-100 p-2 rounded text-gray-300 hover:text-pink-500 flex flex-col justify-center items-center"  onClick={()=>{setUploaded(false); setFile(null)}}>
                                <File className="h-auto w-auto font-light text-pink-500 hover:text-transparent"></File>{file.name.slice(0,5||file.name.length)||"@"}
                                <div className="absolute rounded hover:bg-[#eeea] items-center justify-center hover:text-red-700 text-transparent w-full h-full flex">
                                    <XCircle className=" h-8 w-8 "></XCircle>
                                </div>
                            </div>
                            
                        }
                            <Button className=" text-white mx-4" onClick={()=>{sendRequest()}}>Set Task</Button>
                        </div>
                        
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-[150px] sm:w-[200px] transition-all ease-linear duration-1000 top-[22.5%] ">
                         <defs>
                            <radialGradient id="myLinearGradient" cx="50%" cy="50%" r="50%" fx="20%" fy="20%">
                            <stop offset="0%" style={{stopColor:"#fed",stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:"#e88",stopOpacity:1}} />
                            </radialGradient>
                            <radialGradient id="pupils" cx="50%" cy="40%" r="100%" fx="50%" fy="50%">
                            <stop offset="0%" style={{stopColor:"#112e",stopOpacity:1}} />
                            <stop offset="50%" style={{stopColor:"#488f",stopOpacity:1}} />
                            <stop offset="51%" style={{stopColor:"#6abe",stopOpacity:1}} />
                            <stop offset="80%" style={{stopColor:"#7aee",stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:"#111e",stopOpacity:1}} />
                            </radialGradient>
                            <linearGradient id="eyesline" x1="100%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor:"rgb(0 ,0,0)",stopOpacity:1}} />
                            <stop offset="20%" style={{stopColor:"#fac5",stopOpacity:1}} />
                            <stop offset="80%" style={{stopColor:"#fac5",stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:"rgb(0 ,0,0)",stopOpacity:1}} />
                            </linearGradient>
                            <linearGradient id="eyes" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor:"rgb(255,255,255)",stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:"rgb(150 ,150,150)",stopOpacity:1}} />
                            </linearGradient>
                        </defs>
                        <path d={`M${20-position.x*.2} ${6-position.y*.2} Q${23-position.x*.2} ${5-position.y*.2} ${20-position.x*.2} ${4-position.y*.2}`} fill="none" stroke="black" strokeLinecap="round"></path>
                        <ellipse cx={"6"} cy={"20"} rx={"4"} ry={"5"} fill="#c76"></ellipse>
                        <ellipse cx={"34"} cy={"20"} rx={"4"} ry={"5"} fill="#c76"></ellipse>
                        <ellipse cx={"20"} cy={"20"} rx={"15"} ry={"15"} fill="url(#myLinearGradient)"></ellipse>
                        <ellipse cx={14.5+position.x*.2} cy={17+position.y*.2} rx={"5"} ry={"6"} stroke="url(#eyesline)" fill="url(#eyes)" strokeWidth={".5"} ></ellipse>
                        <ellipse cx={25.5+position.x*.2} cy={17+position.y*.2} rx={"5"} ry={"6"} stroke="url(#eyesline)" strokeWidth={".5"} fill="url(#eyes)"></ellipse>
                        <ellipse  cx={12.5+position.x} cy={14.5+position.y} rx={"1.5"} ry={"2"} strokeWidth={"2.5"} stroke="url(#pupils)" fill="black" ></ellipse>
                        <ellipse  cx={24+position.x} cy={14.5+position.y} rx={"1.5"} ry={"2"} strokeWidth={"2.5"} stroke="url(#pupils)" fill="black" ></ellipse>
                        <path d={`M${12+position.x*0.2} ${10+position.y*0.2} Q${14+position.x*0.2} ${9+position.y*0.2} ${16+position.x*0.2} ${10+position.y*0.2}`} fill="none" strokeLinecap="round" strokeWidth={0.5} stroke="#743f"></path>
                        <path d={`M${24+position.x*0.2} ${10+position.y*0.2} Q${26+position.x*0.2} ${9+position.y*0.2} ${28+position.x*0.2} ${10+position.y*0.2}`} fill="none" strokeLinecap="round" strokeWidth={0.5} stroke="#743f"></path>
                        <path d={`M${17+position.x*.2} ${27+position.y*.2} Q${20+position.x*.3} ${30+position.y*.2} ${23+position.x*.2} ${27+position.y*.2}`} fill="none" stroke="#d34d" strokeLinecap="round"></path>
                    </svg>
                    </div>
                    <div className="h-[100%] w-full">
                        <div className="p-5 w-full inline-flex justify-center text-sm">
                            {handleUpdates()}
                        </div>
                        {   updates.length > 0 &&
                            <div className="flex items-center justify-center">
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}>
                                    <Trash onClick={()=>setNewUpdates([])} className="bg-white p-2 rounded h-10 w-10 hover:text-green-900 cursor-pointer">
                                        Clear
                                    </Trash>
                                </motion.button>
                            </div>
                        }
                    </div>
                </motion.div>
                
            } 
            
        </AnimatePresence>
    </>)
}

export default AutoTaskManager