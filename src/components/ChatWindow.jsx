import Chat from "./Chat";
import { MyContext } from "@/context/MyContext.js";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, threadId, currThreadId, prevChats, setPrevChats } = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    const options = {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
  
  try{
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/chat", options);
    const resResult = await response.json();
    setReply(resResult.reply);
  }catch(err){
    console.log(err);
  }
  setLoading(false);
};


useEffect(()=>{
  if(prompt && reply){
     setPrevChats(prevChats =>(
      [...prevChats,{
        role: "user",
        content: prompt
      },{
        role: "assistant",
        content: reply
      }]
     ))       
  }
  setPrompt("");
},[reply])
  return (
    <div className="bg-[#212121] h-screen w-full flex flex-col justify-between items-center text-center">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center">
        <span className="m-4 sm:ml-40">
          QuestQuill-Ai 
        </span>
        <div className="m-4">
          <span className="bg-[#339cff] h-[25px] w-[25px] rounded-full flex items-center justify-center cursor-pointer">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* Dropdown */}

      <Chat />

      <ScaleLoader color="#fff" loading={loading}/>

      {/* Chat Input */}
      <div className="w-full flex flex-col justify-center items-center">
  <form
    onSubmit={(e) => {
      e.preventDefault();   // stop page refresh
      getReply();           // call your send fn
    }}
    className="w-full relative max-w-[700px] flex justify-between items-center"
  >
    <input
      placeholder="Ask anything"
      className="w-full border-none bg-white/5 p-5 text-sm rounded-[14px] shadow-[rgba(0,0,0,0.05)_0_54px_55px,rgba(0,0,0,0.05)_0_-12px_30px,rgba(0,0,0,0.05)_0_4px_6px,rgba(0,0,0,0.05)_0_12px_3px,rgba(0,0,0,0.05)_0_-3px_5px] focus:outline-none"
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      // Let mobile keyboards submit via the form; still support Enter on desktop:
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          getReply();
        }
      }}
      inputMode="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="none"
    />

    {/* Use a real button so mobile “Go/Send” works */}
    <button
      id="submit"
      type="submit"
      className="cursor-pointer h-[35px] w-[35px] text-xl absolute right-[15px] flex items-center justify-center hover:text-white disabled:opacity-60"
      aria-label="Send"
      disabled={loading || !prompt?.trim()}
    >
      <i className="fa-solid fa-paper-plane"></i>
    </button>
  </form>

  <p className="text-sm py-2 px-0 text-[#b4b4b4]">
    QuestQuill-Ai can make Question Anything.
  </p>
</div>

    </div>
  );
}

export default ChatWindow;
