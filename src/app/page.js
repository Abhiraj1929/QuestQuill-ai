"use client";

import ChatWindow from "@/components/ChatWindow";
import Slidebar from "@/components/Slidebar";
import { MyContext } from "@/context/MyContext";
import { useState } from "react";
import {v1 as uuidv1} from 'uuid';

export default function Home() {

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());

  const providervalue = {
    prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId
  };

  return (
    <>
      <MyContext.Provider value={providervalue}>
        <Slidebar />
        <ChatWindow />
      </MyContext.Provider>
    </>
  );
}
