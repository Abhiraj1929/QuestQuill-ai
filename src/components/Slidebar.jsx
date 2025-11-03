import { useContext, useEffect } from "react";
import { MyContext } from "@/context/MyContext";
import {v1 as uuidv1} from "uuid";
import Image from "next/image";

function Sidebar() {
    const {} = useContext(MyContext);

    

    
    

    return (
        <section className="bg-[#171717] text-[#b4b4b4] h-screen w-80 flex flex-col justify-between">
            <button 
                className="flex justify-between items-center m-2.5 p-2.5 rounded-[5px] bg-transparent border border-white/50 cursor-pointer hover:bg-white/5" 
            >
                <Image 
                    src="/logo.png" 
                    alt="gpt logo" 
                    width={25}
                    height={25}
                    className="bg-white rounded-full object-cover"
                />
                <span className="text-xl">
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="m-2.5 p-2.5 h-full">
              <li className={`list-none cursor-pointer py-0.5 px-[5px] mb-1 text-sm border-10px border-transparent relative hover:bg-white/5 hover:rounded-[10px] group `}>Thread 1</li>
              <li className={`list-none cursor-pointer py-0.5 px-[5px] mb-1 text-sm border-10px border-transparent relative hover:bg-white/5 hover:rounded-[10px] group `}>Thread 2</li>
              <li className={`list-none cursor-pointer py-0.5 px-[5px] mb-1 text-sm border-10px border-transparent relative hover:bg-white/5 hover:rounded-[10px] group `}>Thread 3</li>
            </ul>
 
            <div className="p-2.5 m-2.5 text-sm text-center border-t border-white/50">
                <p>By Abhiraj Kaushal</p>
            </div>
        </section>
    )
}

export default Sidebar;



















{/*    

  import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return (
        <section className="bg-[#171717] text-[#b4b4b4] h-screen w-80 flex flex-col justify-between">
            <button 
                onClick={createNewChat}
                className="flex justify-between items-center m-2.5 p-2.5 rounded-[5px] bg-transparent border border-white/50 cursor-pointer hover:bg-white/5"
            >
                <img 
                    src="src/assets/blacklogo.png" 
                    alt="gpt logo" 
                    className="h-[25px] w-[25px] bg-white rounded-full object-cover"
                />
                <span className="text-xl">
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="m-2.5 p-2.5 h-full">
                {
                    allThreads?.map((thread, idx) => (
                        <li 
                            key={idx} 
                            onClick={(e) => changeThread(thread.threadId)}
                            className={`list-none cursor-pointer py-0.5 px-[5px] mb-1 text-sm border-[10px] border-transparent relative hover:bg-white/5 hover:rounded-[10px] group ${thread.threadId === currThreadId ? "bg-white/5 rounded-[10px]" : ""}`}
                        >
                            {thread.title}
                            <i 
                                className="fa-solid fa-trash opacity-0 absolute right-0 group-hover:opacity-100 group-hover:text-white hover:!text-red-400"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>
 
            <div className="p-2.5 m-2.5 text-sm text-center border-t border-white/50">
                <p>By ApnaCollege &hearts;</p>
            </div>
        </section>
    )
}

export default Sidebar;


          */}