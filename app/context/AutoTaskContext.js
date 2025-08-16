"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const AutoTaskContext = createContext();

export const useAutoTask = () => {
  const context = useContext(AutoTaskContext);
  if (!context) {
    throw new Error("useAutoTask must be used within a AuthContextProvider");
  }
  return context;
};

const saveToLocalStorage=(localData)=>{
  if(localData.actionName==="growth"){
    const prevGrowth = localStorage.getItem("growthLogs")
    const logs = prevGrowth?JSON.parse(prevGrowth):[]
    logs.push(localData.values)
    const newGrowth = JSON.stringify(logs)
    localStorage.setItem("growthLogs",newGrowth);
  }
  else if(localData.actionName==="doctor_contact"){
    const prevContString = localStorage.getItem("importantMedicalContacts");
    let contacts = prevContString ? JSON.parse(prevContString) : [];
    contacts.push(localData.values);
    const newContString = JSON.stringify(contacts);
    localStorage.setItem("importantMedicalContacts", newContString);
  }
}

export const AutoTaskProvider = ({ children }) => {
  const [updates, setUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoTask, setAutoTask] = useState(false)
  const { isAuth } = useAuth();

const getResponse= async (data)=>{
    try{
        setIsLoading(true)

        const formData = new FormData()

        if(!isAuth||!data.message||data.message==="") return;

        formData.append("message",data.message)
        formData.append("time",new Date().toLocaleTimeString())

        if(data.file){
          formData.append("file",data.file)
        }

        const token = localStorage.getItem('token')
        const response = await fetch("api/AutoTask/",{
            method:"POST",
            headers:{
                Authorization:`Bearer ${token}`
            },
            body: formData
        })

        const response_data = await response.json()

        if(Array.isArray(response_data))
        {
          setUpdates([...response_data,...updates])

          for(let localData of response_data)
          {
            saveToLocalStorage(localData)
          }
        }

        else{
          setUpdates([response_data,...updates])
          saveToLocalStorage(response_data)
        }

        return response_data

    }catch(err){
        console.log(err)
        return{ 
                isAction:false,
                actionName:"server error",
                request:"failed"
              }

    }
    finally
    {
        setIsLoading(false)
    }
  }
  

  const value = {
    updates,
    isLoading,
    isAutoTask,
    getResponse,
    setAutoTask,
    setUpdates
  };

  return (
    <AutoTaskContext.Provider value={value}>
      {children}
    </AutoTaskContext.Provider>
  );
}; 