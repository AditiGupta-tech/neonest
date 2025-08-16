"use client";

import React, { useState, useRef, useEffect } from "react";
import {SparkleIcon} from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip"

const AutoTask = ({setAutoTask,isAutoTask}) => {
  const getClassName = ()=>{
    const className = "text-white p-2 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center "
    if(isAutoTask) return "bg-purple-500 hover:bg-purple-600 "+className
    else return "bg-pink-500 hover:bg-pink-600 "+className
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button  onClick={() => setAutoTask(!isAutoTask)}
            className={getClassName()}
            aria-label="Open NeoNest AutoTask"
          >
        <SparkleIcon className="w-5 h-5" /> </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">NeonestAi Task Manager</TooltipContent>
      </Tooltip>
    </TooltipProvider>
        
  );
};

export default AutoTask;